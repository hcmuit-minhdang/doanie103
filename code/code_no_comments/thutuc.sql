use IE103_db;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_review_dossier //
CREATE PROCEDURE sp_review_dossier(
    IN p_dossier_id INT UNSIGNED,
    IN p_officer_id INT UNSIGNED,
    IN p_status     ENUM('approved','rejected'),
    IN p_note       TEXT
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    DECLARE v_msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_msg = MESSAGE_TEXT;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END;
    START TRANSACTION;

    SELECT status INTO v_old_status
    FROM dossier
    WHERE dossier_id = p_dossier_id
    FOR UPDATE;
    IF v_old_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Hồ sơ không tồn tại trên hệ thống!';
    END IF;
    UPDATE dossier 
    SET status = p_status, reviewed_at = NOW(), reviewed_by = p_officer_id, note = p_note 
    WHERE dossier_id = p_dossier_id;
    COMMIT;
    SELECT CONCAT('Thành công: Đã phê duyệt hồ sơ số ', p_dossier_id, ' sang trạng thái ', p_status) AS Thong_Bao;
END //
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_add_household_member //
CREATE PROCEDURE sp_add_household_member(
    IN p_household_id INT UNSIGNED,
    IN p_citizen_id   INT UNSIGNED,
    IN p_relation     VARCHAR(50)
)
BEGIN
    DECLARE v_citizen_exists INT;
    DECLARE v_household_exists INT;

    SELECT COUNT(*) INTO v_citizen_exists FROM citizen WHERE citizen_id = p_citizen_id;
    SELECT COUNT(*) INTO v_household_exists FROM household WHERE household_id = p_household_id;

    IF v_citizen_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Công dân không tồn tại!';
    ELSEIF v_household_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Hộ gia đình không tồn tại!';
    ELSEIF EXISTS (SELECT 1 FROM household_member WHERE citizen_id = p_citizen_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Công dân đã thuộc một hộ gia đình khác!';
    ELSE
        INSERT INTO household_member (household_id, citizen_id, relation, joined_date)
        VALUES (p_household_id, p_citizen_id, p_relation, CURDATE());
        SELECT CONCAT('Thành công: Đã thêm công dân ID = ', p_citizen_id, ' vào hộ gia đình ID = ', p_household_id, ' với vai trò: ', p_relation) AS Thong_Bao;
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_get_campaign_summary_report //
CREATE PROCEDURE sp_get_campaign_summary_report(
    IN p_campaign_id INT UNSIGNED
)
BEGIN
    DECLARE v_exists INT;
    SELECT COUNT(*) INTO v_exists FROM campaign WHERE campaign_id = p_campaign_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chiến dịch không tồn tại trên hệ thống!';
    ELSE
        SELECT CONCAT('Thành công: Đã kết xuất báo cáo tổng hợp cho chiến dịch ID = ', p_campaign_id) AS Thong_Bao;
        SELECT
            c.campaign_name,
            c.year AS campaign_year,
            COUNT(CASE WHEN vl.status = 'done' THEN 1 END) AS thanh_cong,
            COUNT(CASE WHEN vl.status = 'pending' THEN 1 END) AS cho_phat,
            COUNT(CASE WHEN vl.status = 'missed' THEN 1 END) AS bo_lo,
            ROUND(COUNT(CASE WHEN vl.status = 'done' THEN 1 END) * 100.0 / NULLIF(COUNT(vl.visit_log_id), 0), 1) AS ty_le_pct,
            IFNULL(SUM(CASE WHEN gc.category_name = 'Tiền mặt' AND vl.status = 'done' THEN vl.value END), 0) AS tong_tien_mat,
            IFNULL(SUM(CASE WHEN gc.category_name = 'Gạo' AND vl.status = 'done' THEN vl.value END), 0) AS tong_gao_kg
        FROM campaign c
        LEFT JOIN visit_log vl ON c.campaign_id = vl.campaign_id
        LEFT JOIN gift_category gc ON vl.gift_category_id = gc.gift_category_id
        WHERE c.campaign_id = p_campaign_id
        GROUP BY c.campaign_id, c.campaign_name, c.year;
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_transfer_dossier //
CREATE PROCEDURE sp_transfer_dossier(
    IN p_dossier_id INT UNSIGNED,
    IN p_from_agency INT UNSIGNED,
    IN p_to_agency   INT UNSIGNED
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dossier WHERE dossier_id = p_dossier_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Hồ sơ chuyển giao không tồn tại!';
    ELSEIF NOT EXISTS (SELECT 1 FROM agency WHERE agency_id = p_from_agency) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Cơ quan chuyển giao nguồn không tồn tại!';
    ELSEIF NOT EXISTS (SELECT 1 FROM agency WHERE agency_id = p_to_agency) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Cơ quan chuyển giao đích không tồn tại!';
    END IF;

    INSERT INTO dossier_transfer (dossier_id, from_agency, to_agency, transfer_date)
    VALUES (p_dossier_id, p_from_agency, p_to_agency, CURDATE());
    SELECT CONCAT('Thành công: Đã luân chuyển hồ sơ số ', p_dossier_id, ' từ cơ quan ', p_from_agency, ' sang cơ quan ', p_to_agency) AS Thong_Bao;
END //
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_resolve_feedback //
CREATE PROCEDURE sp_resolve_feedback(
    IN p_feedback_ticket_id INT UNSIGNED,
    IN p_officer_id         INT UNSIGNED,
    IN p_reply              TEXT
)
BEGIN
    DECLARE v_exists INT;
    DECLARE v_officer_exists INT;

    SELECT COUNT(*) INTO v_exists FROM feedback_ticket WHERE feedback_ticket_id = p_feedback_ticket_id;
    SELECT COUNT(*) INTO v_officer_exists FROM official WHERE official_id = p_officer_id;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Phiếu phản ánh không tồn tại trên hệ thống!';
    ELSEIF v_officer_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Cán bộ xử lý không tồn tại trên hệ thống!';
    ELSE
        UPDATE feedback_ticket
        SET reply = p_reply, status = 'resolved', resolved_by = p_officer_id, resolved_at = NOW()
        WHERE feedback_ticket_id = p_feedback_ticket_id;
        SELECT CONCAT('Thành công: Đã phản hồi ý kiến phản ánh số ', p_feedback_ticket_id, ' và ghi nhận cán bộ giải quyết ID = ', p_officer_id) AS Thong_Bao;
    END IF;
END //
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS sp_insert_medical_snapshot //
CREATE PROCEDURE sp_insert_medical_snapshot(
    IN p_citizen_id INT UNSIGNED,
    IN p_health_status TEXT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM citizen WHERE citizen_id = p_citizen_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    INSERT INTO medical_snapshot (citizen_id, health_status, recorded_at)
    VALUES (p_citizen_id, p_health_status, NOW());
    SELECT CONCAT('Thành công: Đã ghi nhận bệnh án y tế mới cho công dân ID = ', p_citizen_id, '. Trạng thái: ', p_health_status) AS Thong_Bao;
END //
DELIMITER ;