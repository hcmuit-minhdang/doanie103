use IE103_db;

-- 1. Hàm lấy địa chỉ đầy đủ từ ward_id (Phường, Quận, Tỉnh)
DELIMITER //

DROP FUNCTION IF EXISTS fn_get_full_address //
CREATE FUNCTION fn_get_full_address(p_ward_id VARCHAR(10))
RETURNS VARCHAR(500)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_full_address VARCHAR(500);

    SELECT CONCAT(w.ward_name, ', ', d.district_name, ', ', p.province_name) INTO v_full_address
    FROM ward w
    JOIN district d ON w.district_id = d.district_id
    JOIN province p ON d.province_id = p.province_id
    WHERE w.ward_id = p_ward_id;

    IF v_full_address IS NULL THEN
        RETURN 'Lỗi: Mã phường không tồn tại hoặc không hợp lệ!';
    ELSE
        RETURN CONCAT('Thành công - Địa chỉ đầy đủ: ', v_full_address);
    END IF;
END //

DELIMITER ;

-- 2. Hàm tính tuổi dựa trên ngày sinh và ngày hiện tại
DELIMITER //

DROP FUNCTION IF EXISTS fn_calculate_age //
CREATE FUNCTION fn_calculate_age(p_dob DATE)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
NO SQL
BEGIN
    IF p_dob IS NULL THEN
        RETURN 'Lỗi: Ngày sinh bị rỗng!';
    ELSEIF p_dob > CURDATE() THEN
        RETURN CONCAT('Lỗi: Ngày sinh ', DATE_FORMAT(p_dob, '%d/%m/%Y'), ' ở tương lai không hợp lệ!');
    ELSE
        RETURN CONCAT('Thành công - Tuổi thực tế: ', TIMESTAMPDIFF(YEAR, p_dob, CURDATE()), ' tuổi');
    END IF;
END //

DELIMITER ;

-- 3. Hàm tính tổng mức trợ cấp đang hưởng của một công dân (trợ cấp active)
DELIMITER //

DROP FUNCTION IF EXISTS fn_get_total_monthly_allowance //
CREATE FUNCTION fn_get_total_monthly_allowance(p_citizen_id INT UNSIGNED)
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

    SELECT SUM(ar.base_amount) INTO v_total
    FROM citizen_allowance ca
    JOIN allowance_regime ar ON ca.regime_id = ar.regime_id
    WHERE ca.citizen_id = p_citizen_id AND ca.status = 'active';

    IF v_total IS NULL OR v_total = 0 THEN
        RETURN 'Cảnh báo: Công dân không hưởng bất kỳ khoản trợ cấp active nào (0 VND).';
    ELSE
        RETURN CONCAT('Thành công - Tổng mức trợ cấp active: ', FORMAT(v_total, 0), ' VND');
    END IF;
END //

DELIMITER ;

-- 4. Hàm đếm số nhân khẩu trong một hộ gia đình
DELIMITER //

DROP FUNCTION IF EXISTS fn_count_household_members //
CREATE FUNCTION fn_count_household_members(p_household_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM household WHERE household_id = p_household_id;

    IF v_exists = 0 THEN
        RETURN 'Lỗi: Hộ gia đình không tồn tại trên hệ thống!';
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM household_member
    WHERE household_id = p_household_id;

    RETURN CONCAT('Thành công - Số nhân khẩu: ', IFNULL(v_count, 0), ' người');
END //

DELIMITER ;

-- 5. Hàm kiểm tra tính hợp lệ của thẻ BHYT
DELIMITER //

DROP FUNCTION IF EXISTS fn_check_insurance_validity //
CREATE FUNCTION fn_check_insurance_validity(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_level INT;
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;

    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT benefit_level INTO v_level
    FROM health_insurance
    WHERE citizen_id = p_citizen_id
    ORDER BY health_insurance_id DESC
    LIMIT 1;

    IF v_level IS NULL THEN
        RETURN 'Cảnh báo: Công dân chưa được cấp thẻ Bảo hiểm Y tế ưu đãi!';
    ELSEIF v_level >= 70 AND v_level <= 100 THEN
        RETURN CONCAT('Thành công: Thẻ Bảo hiểm Y tế Hợp lệ! Mức hưởng: ', v_level, '%');
    ELSE
        RETURN CONCAT('Cảnh báo: Thẻ BHYT Không hợp lệ! Mức hưởng: ', v_level, '% (Yêu cầu >= 70%)');
    END IF;
END //

DELIMITER ;

-- 6. Hàm lấy trạng thái hồ sơ gần đây nhất của công dân
DELIMITER //

DROP FUNCTION IF EXISTS fn_get_latest_dossier_status //
CREATE FUNCTION fn_get_latest_dossier_status(p_citizen_id INT UNSIGNED)
RETURNS VARCHAR(250)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_status VARCHAR(50);
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM citizen WHERE citizen_id = p_citizen_id;

    IF v_exists = 0 THEN
        RETURN 'Lỗi: Công dân không tồn tại trên hệ thống!';
    END IF;

    SELECT status INTO v_status
    FROM dossier
    WHERE citizen_id = p_citizen_id
    ORDER BY dossier_id DESC
    LIMIT 1;

    IF v_status IS NULL THEN
        RETURN 'Cảnh báo: Công dân này chưa từng nộp bất kỳ hồ sơ nào trên hệ thống!';
    ELSE
        RETURN CONCAT('Thành công: Trạng thái hồ sơ mới nhất là: ', UPPER(v_status));
    END IF;
END //

DELIMITER ;

-- =====================================================================
-- 🔍 KHỐI KIỂM THỬ VÀ DEMO CHẠY THỬ HÀM (CÓ THÔNG BÁO CHO CẢ VALID / INVALID)
-- =====================================================================

-- 1. Kiểm thử Hàm lấy địa chỉ đầy đủ (fn_get_full_address)
SELECT '--- 1. Kiểm thử fn_get_full_address ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_get_full_address('W26800') AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_get_full_address('W99999') AS 'Khai_Thac_Loi';

-- 2. Kiểm thử Hàm tính tuổi thực tế (fn_calculate_age)
SELECT '--- 2. Kiểm thử fn_calculate_age ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_calculate_age('1970-08-15') AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_calculate_age('2030-01-01') AS 'Khai_Thac_Loi';

-- 3. Kiểm thử Hàm lấy mức trợ cấp active (fn_get_total_monthly_allowance)
SELECT '--- 3. Kiểm thử fn_get_total_monthly_allowance ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_get_total_monthly_allowance(1) AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_get_total_monthly_allowance(99999) AS 'Khai_Thac_Loi';

-- 4. Kiểm thử Hàm đếm nhân khẩu (fn_count_household_members)
SELECT '--- 4. Kiểm thử fn_count_household_members ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_count_household_members(1) AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_count_household_members(99999) AS 'Khai_Thac_Loi';

-- 5. Kiểm thử Hàm kiểm tra BHYT (fn_check_insurance_validity)
SELECT '--- 5. Kiểm thử fn_check_insurance_validity ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_check_insurance_validity(2) AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_check_insurance_validity(24) AS 'Khai_Thac_Loi';

-- 6. Kiểm thử Hàm lấy trạng thái hồ sơ gần nhất (fn_get_latest_dossier_status)
SELECT '--- 6. Kiểm thử fn_get_latest_dossier_status ---' AS 'Kiem_Thu';
-- [VALID]
SELECT fn_get_latest_dossier_status(1) AS 'Khai_Thac_Hop_Le';
-- [INVALID]
SELECT fn_get_latest_dossier_status(24) AS 'Khai_Thac_Loi';