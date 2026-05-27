use IE103_db;

-- 1. Trigger kiểm tra luồng trạng thái hồ sơ & đóng băng hồ sơ đã chốt (BEFORE UPDATE)
DELIMITER //
DROP TRIGGER IF EXISTS trg_dossier_check_status //
CREATE TRIGGER trg_dossier_check_status
BEFORE UPDATE ON dossier
FOR EACH ROW
BEGIN
    -- Đóng băng hồ sơ đã duyệt hoặc bị từ chối
    IF OLD.status IN ('approved', 'rejected') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ho so da chot, khong duoc phep chinh sua bat ky thong tin nao.';
    END IF;
    -- Kiểm tra khi có sự thay đổi trạng thái
    IF NEW.status <> OLD.status THEN
        -- Không cho phép chuyển từ đã nộp về nháp
        IF OLD.status = 'submitted' AND NEW.status = 'draft' THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Khong duoc chuyen ho so da nop ve nhap.';
        END IF;
        -- Ràng buộc cán bộ phê duyệt
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
        -- Thiết lập ngày tự động
        IF NEW.status = 'submitted' AND NEW.submitted_at IS NULL THEN
            SET NEW.submitted_at = CURRENT_TIMESTAMP;
        END IF;
        IF NEW.status IN ('approved', 'rejected') AND NEW.reviewed_at IS NULL THEN
            SET NEW.reviewed_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;
    -- Thiết lập thông báo thành công cho trigger
    SET @trigger_msg = CONCAT('Trigger 1 thành công: Hồ sơ số ', NEW.dossier_id, ' cập nhật thông tin hợp lệ.');
END //
DELIMITER ;

-- 2. Trigger tự động ghi log kiểm toán khi hồ sơ thay đổi trạng thái duyệt (AFTER UPDATE)
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
        
        -- Thiết lập thông báo thành công
        SET @trigger_msg = CONCAT('Trigger 2 thành công: Đã ghi nhận lịch sử duyệt hồ sơ số ', NEW.dossier_id, ' của cán bộ ID = ', NEW.reviewed_by, ' vào audit_log.');
    END IF;
END //
DELIMITER ;

-- 3. Trigger tự động cấp chế độ thụ hưởng trợ cấp khi hồ sơ được duyệt (AFTER UPDATE)
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
                WHEN 1 THEN 1  -- Thương binh -> Trợ cấp thương binh (4,200,000 đ)
                WHEN 2 THEN 2  -- Thân nhân Liệt sĩ -> Trợ cấp tuất hàng tháng (2,100,000 đ)
                WHEN 3 THEN 3  -- Người nhiễm CĐHH -> Trợ cấp CĐHH (1,850,000 đ)
                WHEN 4 THEN 4  -- Bà mẹ Việt Nam Anh hùng -> Trợ cấp phụng dưỡng (3,600,000 đ)
                WHEN 5 THEN 5  -- Bệnh binh -> Trợ cấp bệnh binh (3,000,000 đ)
                WHEN 6 THEN 6  -- Con đẻ người nhiễm CĐHH -> Trợ cấp con CĐHH (1,200,000 đ)
                ELSE NULL
            END AS regime_id,
            CURDATE(), NULL, 'active'
        FROM object_mapping om
        WHERE om.citizen_id = NEW.citizen_id
          AND om.status = 'active';

        -- Thiết lập thông báo thành công
        SET @trigger_msg = CONCAT('Trigger 3 thành công: Duyệt hồ sơ số ', NEW.dossier_id, ' -> Tự động chèn ví trợ cấp active thành công cho công dân ID = ', NEW.citizen_id);
    END IF;
END //
DELIMITER ;

-- 4. Trigger kiểm tra điều kiện diện chính sách hoạt động khi thêm mới trợ cấp (BEFORE INSERT)

DELIMITER //
DROP TRIGGER IF EXISTS trg_allowance_need_policy //
CREATE TRIGGER trg_allowance_need_policy
BEFORE INSERT ON citizen_allowance
FOR EACH ROW
BEGIN
    -- Kiểm tra diện chính sách active
    IF NOT EXISTS (SELECT 1 FROM object_mapping WHERE citizen_id = NEW.citizen_id AND status = 'active') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cong dan chua co dien chinh sach active.';
    END IF;

    -- Kiểm tra logic thời gian
    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ngay bat dau khong duoc sau ngay ket thuc.';
    END IF;

    -- Thiết lập thông báo thành công
    SET @trigger_msg = CONCAT('Trigger 4 thành công: Cấp ví trợ cấp hợp lệ cho công dân ID = ', NEW.citizen_id);
END //
DELIMITER ;

-- 5. Trigger kiểm tra điều kiện diện chính sách khi cập nhật trợ cấp (BEFORE UPDATE)
DELIMITER //
DROP TRIGGER IF EXISTS trg_allowance_need_policy_update //
CREATE TRIGGER trg_allowance_need_policy_update
BEFORE UPDATE ON citizen_allowance
FOR EACH ROW
BEGIN
    -- Chỉ kiểm tra nếu trạng thái cập nhật hoặc kích hoạt lại là active
    IF NEW.status = 'active' AND NOT EXISTS (SELECT 1 FROM object_mapping WHERE citizen_id = NEW.citizen_id AND status = 'active') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cong dan chua co dien chinh sach active.';
    END IF;

    -- Kiểm tra logic thời gian
    IF NEW.end_date IS NOT NULL AND NEW.start_date > NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ngay bat dau khong duoc sau ngay ket thuc.';
    END IF;

    -- Thiết lập thông báo thành công
    SET @trigger_msg = CONCAT('Trigger 5 thành công: Cập nhật ví trợ cấp công dân ID = ', NEW.citizen_id, ' hợp lệ.');
END //
DELIMITER ;

-- 6. Trigger tự động tạm đình chỉ trợ cấp khi diện chính sách hết hiệu lực (AFTER UPDATE)
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

        -- Thiết lập thông báo thành công
        SET @trigger_msg = CONCAT('Trigger 6 thành công: Diện chính sách công dân ID = ', NEW.citizen_id, ' ngưng hoạt động -> Tự động đình chỉ (suspended) các trợ cấp liên đới.');
    END IF;
END //
DELIMITER ;

-- 7. Trigger tự động ghi nhật ký kiểm toán khi cán bộ sửa các thông tin nhạy cảm của công dân (AFTER UPDATE)
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
        -- Thiết lập thông báo thành công
        SET @trigger_msg = CONCAT('Trigger 7 thành công: Phát hiện thông tin nhạy cảm của công dân ID = ', NEW.citizen_id, ' thay đổi -> Tự ghi nhận log kiểm toán.');
    END IF;
END //
DELIMITER ;

