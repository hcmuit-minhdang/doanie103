use IE103_db;

DELIMITER //
DROP TRIGGER IF EXISTS trg_dossier_check_status //
CREATE TRIGGER trg_dossier_check_status
BEFORE UPDATE ON dossier
FOR EACH ROW
BEGIN

    IF OLD.status IN ('approved', 'rejected') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ho so da chot, khong duoc phep chinh sua bat ky thong tin nao.';
    END IF;

    IF NEW.status <> OLD.status THEN

        IF OLD.status = 'submitted' AND NEW.status = 'draft' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Khong duoc chuyen ho so da nop ve nhap.';
        END IF;

        IF NEW.status IN ('approved', 'rejected') THEN
            IF OLD.status <> 'submitted' THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Chi duyet/tu choi ho so dang submitted.';
            END IF;
            IF NEW.reviewed_by IS NULL THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Thieu ma can bo phe duyet.';
            END IF;
        END IF;

        IF NEW.status = 'submitted' AND NEW.submitted_at IS NULL THEN
            SET NEW.submitted_at = CURRENT_TIMESTAMP;
        END IF;
        IF NEW.status IN ('approved', 'rejected') AND NEW.reviewed_at IS NULL THEN
            SET NEW.reviewed_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;

    SET @trigger_msg = CONCAT('Trigger 1 thành công: Hồ sơ số ', NEW.dossier_id, ' cập nhật thông tin hợp lệ.');
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS trg_dossier_audit_status //
CREATE TRIGGER trg_dossier_audit_status
AFTER UPDATE ON dossier
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_log (
            official_id, action, table_name, record_id,
            old_data, new_data, ip_address
        ) VALUES (
            NEW.reviewed_by,
            'UPDATE',
            'dossier',
            NEW.dossier_id,
            JSON_OBJECT('status', OLD.status,
                        'reviewed_by', OLD.reviewed_by,
                        'note', OLD.note),
            JSON_OBJECT('status', NEW.status,
                        'reviewed_by', NEW.reviewed_by,
                        'note', NEW.note),
            IFNULL(@app_client_ip, '127.0.0.1')
        );

        SET @trigger_msg = CONCAT('Trigger 2 thành công: Đã ghi nhận lịch sử duyệt hồ sơ số ', NEW.dossier_id, ' của cán bộ ID = ', NEW.reviewed_by, ' vào audit_log.');
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS tg_dossier_after_approve //
CREATE TRIGGER tg_dossier_after_approve
AFTER UPDATE ON dossier
FOR EACH ROW FOLLOWS trg_dossier_audit_status
BEGIN
    IF OLD.status <> 'approved' AND NEW.status = 'approved' THEN
        INSERT IGNORE INTO citizen_allowance
            (citizen_id, regime_id, start_date, end_date, status)
        SELECT
            NEW.citizen_id,
            CASE om.object_id
                WHEN 1 THEN 1  
                WHEN 2 THEN 2  
                WHEN 3 THEN 3  
                WHEN 4 THEN 4  
                WHEN 5 THEN 5  
                WHEN 6 THEN 6  
                ELSE NULL
            END AS regime_id,
            CURDATE(), NULL, 'active'
        FROM object_mapping om
        WHERE om.citizen_id = NEW.citizen_id
          AND om.status = 'active';

        SET @trigger_msg = CONCAT('Trigger 3 thành công: Duyệt hồ sơ số ', NEW.dossier_id, ' -> Tự động chèn ví trợ cấp active thành công cho công dân ID = ', NEW.citizen_id);
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS trg_allowance_need_policy //
CREATE TRIGGER trg_allowance_need_policy
BEFORE INSERT ON citizen_allowance
FOR EACH ROW
BEGIN

    IF NOT EXISTS (SELECT 1 FROM object_mapping WHERE citizen_id = NEW.citizen_id AND status = 'active') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cong dan chua co dien chinh sach active.';
    END IF;

    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ngay bat dau khong duoc sau ngay ket thuc.';
    END IF;

    SET @trigger_msg = CONCAT('Trigger 4 thành công: Cấp ví trợ cấp hợp lệ cho công dân ID = ', NEW.citizen_id);
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS trg_allowance_need_policy_update //
CREATE TRIGGER trg_allowance_need_policy_update
BEFORE UPDATE ON citizen_allowance
FOR EACH ROW
BEGIN

    IF NEW.status = 'active' AND NOT EXISTS (SELECT 1 FROM object_mapping WHERE citizen_id = NEW.citizen_id AND status = 'active') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cong dan chua co dien chinh sach active.';
    END IF;

    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ngay bat dau khong duoc sau ngay ket thuc.';
    END IF;

    SET @trigger_msg = CONCAT('Trigger 5 thành công: Cập nhật ví trợ cấp công dân ID = ', NEW.citizen_id, ' hợp lệ.');
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS trg_policy_expire_suspend_allowance //
CREATE TRIGGER trg_policy_expire_suspend_allowance
AFTER UPDATE ON object_mapping
FOR EACH ROW
BEGIN
    IF OLD.status = 'active' AND NEW.status IN ('expired', 'paused') THEN
        UPDATE citizen_allowance
        SET status   = 'suspended',
            end_date = CURDATE()
        WHERE citizen_id = NEW.citizen_id
          AND status = 'active';

        SET @trigger_msg = CONCAT('Trigger 6 thành công: Diện chính sách công dân ID = ', NEW.citizen_id, ' ngưng hoạt động -> Tự động đình chỉ (suspended) các trợ cấp liên đới.');
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS tg_audit_citizen_changes //
CREATE TRIGGER tg_audit_citizen_changes
AFTER UPDATE ON citizen
FOR EACH ROW
BEGIN
    IF IFNULL(OLD.full_name, '')     <> IFNULL(NEW.full_name, '')
    OR IFNULL(OLD.cccd_number, '')   <> IFNULL(NEW.cccd_number, '')
    OR NOT (OLD.dob <=> NEW.dob)
    OR IFNULL(OLD.ward_id, '')       <> IFNULL(NEW.ward_id, '')
    OR IFNULL(OLD.address_detail,'') <> IFNULL(NEW.address_detail,'')
    THEN
        INSERT INTO audit_log (
            official_id, action, table_name, record_id,
            old_data, new_data, ip_address
        ) VALUES (
            NULLIF(@current_official_id, 0),
            'UPDATE',
            'citizen',
            NEW.citizen_id,
            JSON_OBJECT(
                'full_name',      OLD.full_name,
                'cccd_number',    OLD.cccd_number,
                'dob',            OLD.dob,
                'ward_id',        OLD.ward_id,
                'address_detail', OLD.address_detail
            ),
            JSON_OBJECT(
                'full_name',      NEW.full_name,
                'cccd_number',    NEW.cccd_number,
                'dob',            NEW.dob,
                'ward_id',        NEW.ward_id,
                'address_detail', NEW.address_detail
            ),
            IFNULL(@app_client_ip, '127.0.0.1')
        );

        SET @trigger_msg = CONCAT('Trigger 7 thành công: Phát hiện thông tin nhạy cảm của công dân ID = ', NEW.citizen_id, ' thay đổi -> Tự ghi nhận log kiểm toán.');
    END IF;
END //
DELIMITER ;