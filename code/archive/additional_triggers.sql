USE IE103_db;

-- =============================================
-- TRIGGER 8: Tự động cập nhật trạng thái ủy quyền hết hạn
-- Mục đích: Khi truy vấn bảng authorization, nếu end_date < CURDATE() thì tự chuyển status = 'expired'
-- Thực tế: Chạy trước khi SELECT (không trigger được), nên dùng BEFORE UPDATE để rà soát
-- Giải pháp: Trigger BEFORE INSERT trên visit_log - khi phát quà, kiểm tra ủy quyền còn hiệu lực
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_visit_check_authorization //
CREATE TRIGGER trg_visit_check_authorization
BEFORE INSERT ON visit_log
FOR EACH ROW
BEGIN
    -- Nếu người nhận quà có ủy quyền, kiểm tra ủy quyền còn hiệu lực không
    DECLARE v_has_expired_auth INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_has_expired_auth
    FROM `authorization`
    WHERE proxy_id = NEW.citizen_id
      AND status = 'active'
      AND end_date < CURDATE();
    
    -- Tự động cập nhật các ủy quyền hết hạn liên quan
    IF v_has_expired_auth > 0 THEN
        UPDATE `authorization`
        SET status = 'expired'
        WHERE proxy_id = NEW.citizen_id
          AND status = 'active'
          AND end_date < CURDATE();
    END IF;
    
    SET @trigger_msg = CONCAT('Trigger 8 thành công: Đã kiểm tra và cập nhật ủy quyền hết hạn khi ghi nhận phát quà cho công dân ID = ', NEW.citizen_id);
END //
DELIMITER ;

-- =============================================
-- TRIGGER 9: Ngăn chặn tạo ủy quyền trùng lặp (cùng chủ chính sách, cùng người nhận thay, còn active)
-- Mục đích: Một cặp (policy_holder, proxy) chỉ được có 1 ủy quyền active tại 1 thời điểm
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_authorization_prevent_duplicate //
CREATE TRIGGER trg_authorization_prevent_duplicate
BEFORE INSERT ON `authorization`
FOR EACH ROW
BEGIN
    DECLARE v_existing INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_existing
    FROM `authorization`
    WHERE policy_holder_id = NEW.policy_holder_id
      AND proxy_id = NEW.proxy_id
      AND status = 'active'
      AND (end_date IS NULL OR end_date >= CURDATE());
    
    IF v_existing > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Loi: Da ton tai giay uy quyen active cho cap nay. Vui long thu hoi truoc khi tao moi.';
    END IF;
    
    -- Không cho ủy quyền cho chính mình
    IF NEW.policy_holder_id = NEW.proxy_id THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Loi: Khong duoc uy quyen cho chinh minh.';
    END IF;
    
    SET @trigger_msg = CONCAT('Trigger 9 thành công: Ủy quyền mới hợp lệ cho chủ CS ID = ', NEW.policy_holder_id, ', người nhận thay ID = ', NEW.proxy_id);
END //
DELIMITER ;

-- =============================================
-- TRIGGER 10: Ghi audit_log khi phản ánh kiến nghị được cập nhật trạng thái
-- Mục đích: Theo dõi toàn bộ vòng đời xử lý phiếu phản ánh
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_feedback_audit_status //
CREATE TRIGGER trg_feedback_audit_status
AFTER UPDATE ON feedback_ticket
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_log (
            official_id, action, table_name, record_id,
            old_data, new_data, ip_address
        ) VALUES (
            NEW.resolved_by,
            'UPDATE',
            'feedback_ticket',
            NEW.feedback_ticket_id,
            JSON_OBJECT('status', OLD.status, 'reply', OLD.reply, 'resolved_by', OLD.resolved_by),
            JSON_OBJECT('status', NEW.status, 'reply', NEW.reply, 'resolved_by', NEW.resolved_by),
            IFNULL(@app_client_ip, '127.0.0.1')
        );
        
        SET @trigger_msg = CONCAT('Trigger 10 thành công: Ghi nhận thay đổi trạng thái phiếu PA số ', NEW.feedback_ticket_id, ' từ ', OLD.status, ' sang ', NEW.status);
    END IF;
END //
DELIMITER ;

-- =============================================
-- TRIGGER 11: Kiểm tra chi trả - chỉ cho phép tạo payment khi công dân có trợ cấp active
-- Mục đích: Ngăn chi trả nhầm cho người không còn hưởng trợ cấp
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_payment_validate_allowance //
CREATE TRIGGER trg_payment_validate_allowance
BEFORE INSERT ON payment_history
FOR EACH ROW
BEGIN
    DECLARE v_allowance_active INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_allowance_active
    FROM citizen_allowance
    WHERE citizen_id = NEW.citizen_id
      AND regime_id = NEW.regime_id
      AND status = 'active';
    
    -- Chỉ cảnh báo bằng cách ghi note, không chặn (vì có thể chi trả truy lĩnh)
    IF v_allowance_active = 0 AND NEW.status = 'success' THEN
        SET NEW.payment_note = CONCAT(IFNULL(NEW.payment_note, ''), ' [CẢNH BÁO: Trợ cấp không ở trạng thái active tại thời điểm chi trả]');
    END IF;
    
    SET @trigger_msg = CONCAT('Trigger 11 thành công: Đã kiểm tra trạng thái trợ cấp trước khi ghi nhận chi trả cho công dân ID = ', NEW.citizen_id);
END //
DELIMITER ;

-- =============================================
-- TRIGGER 12: Tự động ghi audit_log khi tạo payment mới
-- Mục đích: Mọi giao dịch tài chính đều phải có log kiểm toán
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_payment_audit_insert //
CREATE TRIGGER trg_payment_audit_insert
AFTER INSERT ON payment_history
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        official_id, action, table_name, record_id,
        old_data, new_data, ip_address
    ) VALUES (
        NULLIF(@current_official_id, 0),
        'INSERT',
        'payment_history',
        NEW.payment_id,
        NULL,
        JSON_OBJECT(
            'citizen_id', NEW.citizen_id,
            'regime_id', NEW.regime_id,
            'amount', NEW.amount,
            'payment_date', NEW.payment_date,
            'status', NEW.status,
            'bank_name', NEW.bank_name
        ),
        IFNULL(@app_client_ip, 'localhost')
    );
    
    SET @trigger_msg = CONCAT('Trigger 12 thành công: Đã ghi log kiểm toán cho giao dịch chi trả ID = ', NEW.payment_id);
END //
DELIMITER ;

-- =============================================
-- TRIGGER 13: Tự động set submitted_at khi dossier chuyển từ draft sang submitted (INSERT)
-- Mục đích: Bổ sung cho trigger 1 - xử lý case INSERT trực tiếp với status = 'submitted'
-- =============================================
DELIMITER //
DROP TRIGGER IF EXISTS trg_dossier_auto_timestamp_insert //
CREATE TRIGGER trg_dossier_auto_timestamp_insert
BEFORE INSERT ON dossier
FOR EACH ROW
BEGIN
    IF NEW.status = 'submitted' AND NEW.submitted_at IS NULL THEN
        SET NEW.submitted_at = CURRENT_TIMESTAMP;
    END IF;
    
    -- Không cho phép INSERT trực tiếp với status approved/rejected
    IF NEW.status IN ('approved', 'rejected') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Loi: Khong duoc tao ho so voi trang thai approved hoac rejected.';
    END IF;
    
    SET @trigger_msg = CONCAT('Trigger 13 thành công: Hồ sơ mới ID tự động được gán timestamp phù hợp.');
END //
DELIMITER ;
