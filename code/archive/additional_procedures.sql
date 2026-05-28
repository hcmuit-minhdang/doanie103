USE IE103_db;

-- =============================================
-- PROCEDURE 7: Tạo hồ sơ mới (draft) kèm đính kèm
-- Mục đích: Công dân tạo hồ sơ trực tuyến, validate đầu vào, trả về dossier_id
-- Sử dụng: Frontend form "Đăng ký hồ sơ mới"
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_create_dossier //
CREATE PROCEDURE sp_create_dossier(
    IN p_citizen_id   INT UNSIGNED,
    IN p_dossier_type ENUM('new_regime','adjust_regime','stop_regime'),
    IN p_note         TEXT,
    IN p_auto_submit  BOOLEAN
)
BEGIN
    DECLARE v_citizen_exists INT;
    DECLARE v_new_dossier_id INT UNSIGNED;
    DECLARE v_status VARCHAR(20) DEFAULT 'draft';
    DECLARE v_msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_msg = MESSAGE_TEXT;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END;

    START TRANSACTION;
    
    SELECT COUNT(*) INTO v_citizen_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_citizen_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;
    
    IF p_auto_submit = TRUE THEN
        SET v_status = 'submitted';
    END IF;
    
    INSERT INTO dossier (citizen_id, status, dossier_type, note)
    VALUES (p_citizen_id, v_status, p_dossier_type, p_note);
    
    SET v_new_dossier_id = LAST_INSERT_ID();
    
    COMMIT;
    
    SELECT v_new_dossier_id AS dossier_id,
           CONCAT('Thành công: Đã tạo hồ sơ mới số ', v_new_dossier_id, ' với trạng thái ', v_status) AS Thong_Bao;
END //
DELIMITER ;

-- =============================================
-- PROCEDURE 8: Cập nhật thông tin công dân (có ghi audit_log qua trigger 7)
-- Mục đích: Cán bộ cập nhật CCCD, họ tên, ngày sinh, địa chỉ
-- Sử dụng: Dashboard cán bộ - Quản lý đối tượng chính sách
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_update_citizen_info //
CREATE PROCEDURE sp_update_citizen_info(
    IN p_citizen_id     INT UNSIGNED,
    IN p_full_name      VARCHAR(100),
    IN p_dob            DATE,
    IN p_gender         ENUM('M','F','O'),
    IN p_ward_id        VARCHAR(10),
    IN p_address_detail VARCHAR(255),
    IN p_officer_id     INT UNSIGNED
)
BEGIN
    DECLARE v_exists INT;
    DECLARE v_msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_msg = MESSAGE_TEXT;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END;

    START TRANSACTION;
    
    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Công dân không tồn tại!';
    END IF;
    
    -- Set session variable cho trigger audit_log
    SET @current_official_id = p_officer_id;
    
    UPDATE citizen
    SET full_name      = COALESCE(p_full_name, full_name),
        dob            = COALESCE(p_dob, dob),
        gender         = COALESCE(p_gender, gender),
        ward_id        = COALESCE(p_ward_id, ward_id),
        address_detail = COALESCE(p_address_detail, address_detail)
    WHERE citizen_id = p_citizen_id;
    
    COMMIT;
    
    SELECT CONCAT('Thành công: Đã cập nhật thông tin công dân ID = ', p_citizen_id) AS Thong_Bao;
END //
DELIMITER ;

-- =============================================
-- PROCEDURE 9: Tạo ủy quyền mới
-- Mục đích: Đăng ký ủy quyền nhận trợ cấp thay
-- Sử dụng: Dashboard cán bộ - Quản lý giấy ủy quyền
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_create_authorization //
CREATE PROCEDURE sp_create_authorization(
    IN p_policy_holder_id INT UNSIGNED,
    IN p_proxy_id         INT UNSIGNED,
    IN p_relation         VARCHAR(50),
    IN p_document_url     VARCHAR(500),
    IN p_start_date       DATE,
    IN p_end_date         DATE
)
BEGIN
    DECLARE v_holder_exists INT;
    DECLARE v_proxy_exists INT;
    DECLARE v_msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_msg = MESSAGE_TEXT;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END;

    START TRANSACTION;
    
    SELECT COUNT(*) INTO v_holder_exists FROM citizen WHERE citizen_id = p_policy_holder_id;
    SELECT COUNT(*) INTO v_proxy_exists FROM citizen WHERE citizen_id = p_proxy_id;
    
    IF v_holder_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chủ chính sách không tồn tại!';
    ELSEIF v_proxy_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Người nhận thay không tồn tại!';
    ELSEIF p_start_date > p_end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Ngày bắt đầu không được sau ngày kết thúc!';
    END IF;
    
    -- Trigger trg_authorization_prevent_duplicate sẽ kiểm tra trùng lặp
    INSERT INTO `authorization` (policy_holder_id, proxy_id, relation, document_url, start_date, end_date, status)
    VALUES (p_policy_holder_id, p_proxy_id, p_relation, p_document_url, p_start_date, p_end_date, 'active');
    
    COMMIT;
    
    SELECT CONCAT('Thành công: Đã tạo ủy quyền từ công dân ID = ', p_policy_holder_id, ' cho người nhận thay ID = ', p_proxy_id) AS Thong_Bao;
END //
DELIMITER ;

-- =============================================
-- PROCEDURE 10: Thu hồi ủy quyền
-- Mục đích: Cán bộ thu hồi giấy ủy quyền khi cần
-- Sử dụng: Dashboard cán bộ - Quản lý giấy ủy quyền
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_revoke_authorization //
CREATE PROCEDURE sp_revoke_authorization(
    IN p_authorization_id INT UNSIGNED,
    IN p_officer_id       INT UNSIGNED
)
BEGIN
    DECLARE v_exists INT;
    DECLARE v_current_status VARCHAR(20);
    
    SELECT COUNT(*), MAX(status) INTO v_exists, v_current_status
    FROM `authorization`
    WHERE authorization_id = p_authorization_id;
    
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Giấy ủy quyền không tồn tại!';
    ELSEIF v_current_status <> 'active' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chỉ có thể thu hồi ủy quyền đang active!';
    END IF;
    
    UPDATE `authorization`
    SET status = 'revoked'
    WHERE authorization_id = p_authorization_id;
    
    -- Ghi log kiểm toán
    INSERT INTO audit_log (official_id, action, table_name, record_id, old_data, new_data, ip_address)
    VALUES (p_officer_id, 'UPDATE', 'authorization', p_authorization_id,
            JSON_OBJECT('status', 'active'),
            JSON_OBJECT('status', 'revoked'),
            IFNULL(@app_client_ip, '127.0.0.1'));
    
    SELECT CONCAT('Thành công: Đã thu hồi ủy quyền số ', p_authorization_id) AS Thong_Bao;
END //
DELIMITER ;

-- =============================================
-- PROCEDURE 11: Thống kê dashboard tổng quan
-- Mục đích: Trả về các chỉ số thống kê cho dashboard cán bộ
-- Sử dụng: Dashboard cán bộ - Trang tổng quan
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_get_dashboard_stats //
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
    -- Thống kê hồ sơ
    SELECT 
        COUNT(*) AS total_dossiers,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS pending_dossiers,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_dossiers,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_dossiers,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft_dossiers
    FROM dossier;
    
    -- Thống kê công dân & chính sách
    SELECT 
        (SELECT COUNT(*) FROM citizen) AS total_citizens,
        (SELECT COUNT(DISTINCT citizen_id) FROM object_mapping WHERE status = 'active') AS active_policy_holders,
        (SELECT COUNT(DISTINCT citizen_id) FROM citizen_allowance WHERE status = 'active') AS active_beneficiaries,
        (SELECT IFNULL(SUM(ar.base_amount), 0) 
         FROM citizen_allowance ca JOIN allowance_regime ar ON ca.regime_id = ar.regime_id 
         WHERE ca.status = 'active') AS total_monthly_budget;
    
    -- Thống kê phản ánh kiến nghị
    SELECT
        COUNT(*) AS total_feedbacks,
        SUM(CASE WHEN status IN ('open','in_progress') THEN 1 ELSE 0 END) AS pending_feedbacks,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_feedbacks,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed_feedbacks
    FROM feedback_ticket;
    
    -- Thống kê chi trả tháng hiện tại
    SELECT
        COUNT(*) AS total_payments_this_month,
        IFNULL(SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END), 0) AS total_paid_amount,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_payments
    FROM payment_history
    WHERE MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE());
    
    SELECT 'Thành công: Đã kết xuất thống kê dashboard tổng quan' AS Thong_Bao;
END //
DELIMITER ;

-- =============================================
-- PROCEDURE 12: Nộp hồ sơ (chuyển draft -> submitted)
-- Mục đích: Công dân nộp hồ sơ đã soạn
-- Sử dụng: Frontend - Nộp hồ sơ
-- =============================================
DELIMITER //
DROP PROCEDURE IF EXISTS sp_submit_dossier //
CREATE PROCEDURE sp_submit_dossier(
    IN p_dossier_id INT UNSIGNED,
    IN p_citizen_id INT UNSIGNED
)
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_owner INT UNSIGNED;
    DECLARE v_msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_msg = MESSAGE_TEXT;
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
    END;

    START TRANSACTION;
    
    SELECT status, citizen_id INTO v_status, v_owner
    FROM dossier
    WHERE dossier_id = p_dossier_id
    FOR UPDATE;
    
    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Hồ sơ không tồn tại!';
    ELSEIF v_owner <> p_citizen_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Bạn không có quyền nộp hồ sơ này!';
    ELSEIF v_status <> 'draft' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Chỉ có thể nộp hồ sơ đang ở trạng thái bản nháp!';
    END IF;
    
    UPDATE dossier
    SET status = 'submitted', submitted_at = NOW()
    WHERE dossier_id = p_dossier_id;
    
    COMMIT;
    
    SELECT CONCAT('Thành công: Đã nộp hồ sơ số ', p_dossier_id) AS Thong_Bao;
END //
DELIMITER ;
