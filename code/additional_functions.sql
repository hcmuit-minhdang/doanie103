USE IE103_db;

-- =============================================
-- FUNCTION 7: Đếm số ủy quyền đang active của một công dân (là chủ chính sách)
-- Mục đích: Hiển thị trên dashboard cán bộ - cột "Số UQ active"
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_count_active_authorizations //
CREATE FUNCTION fn_count_active_authorizations(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM `authorization`
    WHERE policy_holder_id = p_citizen_id
      AND status = 'active'
      AND (end_date IS NULL OR end_date >= CURDATE());

    RETURN CONCAT('Thành công - Số ủy quyền đang active: ', v_count);
END //
DELIMITER ;

-- =============================================
-- FUNCTION 8: Tính tổng số tiền đã chi trả cho công dân trong một tháng cụ thể
-- Mục đích: Hiển thị trên dashboard chi trả - cột "Tổng chi trả tháng"
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_get_monthly_payment_total //
CREATE FUNCTION fn_get_monthly_payment_total(p_citizen_id INT UNSIGNED, p_month INT, p_year INT)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(15,2);
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT IFNULL(SUM(amount), 0) INTO v_total
    FROM payment_history
    WHERE citizen_id = p_citizen_id
      AND MONTH(payment_date) = p_month
      AND YEAR(payment_date) = p_year
      AND status = 'success';

    IF v_total = 0 THEN
        RETURN CONCAT('Cảnh báo: Không có giao dịch thành công nào trong tháng ', p_month, '/', p_year);
    ELSE
        RETURN CONCAT('Thành công - Tổng chi trả tháng ', p_month, '/', p_year, ': ', FORMAT(v_total, 0), ' VND');
    END IF;
END //
DELIMITER ;

-- =============================================
-- FUNCTION 9: Tính thời gian hưởng trợ cấp (số năm, tháng)
-- Mục đích: Hiển thị thâm niên hưởng trợ cấp trên hồ sơ công dân
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_calculate_allowance_duration //
CREATE FUNCTION fn_calculate_allowance_duration(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_start DATE;
    DECLARE v_years INT;
    DECLARE v_months INT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT MIN(start_date) INTO v_start
    FROM citizen_allowance
    WHERE citizen_id = p_citizen_id;

    IF v_start IS NULL THEN
        RETURN 'Cảnh báo: Công dân chưa từng được cấp trợ cấp!';
    END IF;

    SET v_years = TIMESTAMPDIFF(YEAR, v_start, CURDATE());
    SET v_months = TIMESTAMPDIFF(MONTH, v_start, CURDATE()) - (v_years * 12);

    RETURN CONCAT('Thành công - Thâm niên hưởng trợ cấp: ', v_years, ' năm ', v_months, ' tháng (từ ', DATE_FORMAT(v_start, '%d/%m/%Y'), ')');
END //
DELIMITER ;

-- =============================================
-- FUNCTION 10: Lấy tên đối tượng chính sách của công dân
-- Mục đích: Hiển thị "Diện chính sách" trên profile công dân
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_get_citizen_policy_name //
CREATE FUNCTION fn_get_citizen_policy_name(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(500)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_policy_names TEXT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT GROUP_CONCAT(po.object_name SEPARATOR ', ') INTO v_policy_names
    FROM object_mapping om
    JOIN policy_object po ON om.object_id = po.object_id
    WHERE om.citizen_id = p_citizen_id
      AND om.status = 'active';

    IF v_policy_names IS NULL THEN
        RETURN 'Cảnh báo: Công dân không thuộc diện chính sách active nào!';
    ELSE
        RETURN CONCAT('Thành công - Diện chính sách: ', v_policy_names);
    END IF;
END //
DELIMITER ;

-- =============================================
-- FUNCTION 11: Kiểm tra công dân có hồ sơ đang chờ xử lý hay không
-- Mục đích: Ngăn nộp hồ sơ trùng khi đã có hồ sơ pending
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_has_pending_dossier //
CREATE FUNCTION fn_has_pending_dossier(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_pending INT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;
    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT COUNT(*) INTO v_pending
    FROM dossier
    WHERE citizen_id = p_citizen_id
      AND status IN ('draft', 'submitted');

    IF v_pending > 0 THEN
        RETURN CONCAT('Cảnh báo: Công dân đang có ', v_pending, ' hồ sơ chưa xử lý xong!');
    ELSE
        RETURN 'Thành công: Công dân không có hồ sơ đang chờ xử lý, có thể nộp mới.';
    END IF;
END //
DELIMITER ;

-- =============================================
-- FUNCTION 12: Tính tỷ lệ giải quyết phản ánh kiến nghị (%)
-- Mục đích: Hiển thị KPI trên dashboard Phản ánh & Kiến nghị
-- =============================================
DELIMITER //
DROP FUNCTION IF EXISTS fn_feedback_resolution_rate //
CREATE FUNCTION fn_feedback_resolution_rate()
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total INT;
    DECLARE v_resolved INT;
    DECLARE v_rate DECIMAL(5,1);

    SELECT COUNT(*) INTO v_total FROM feedback_ticket;
    SELECT COUNT(*) INTO v_resolved FROM feedback_ticket WHERE status IN ('resolved', 'closed');

    IF v_total = 0 THEN
        RETURN 'Cảnh báo: Chưa có phiếu phản ánh nào trên hệ thống!';
    END IF;

    SET v_rate = (v_resolved * 100.0) / v_total;

    RETURN CONCAT('Thành công - Tỷ lệ giải quyết: ', v_rate, '% (', v_resolved, '/', v_total, ')');
END //
DELIMITER ;
