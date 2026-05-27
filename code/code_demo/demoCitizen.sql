
-- ==============================================================================
-- 🏠 PHẦN 6: VAI TRÒ CÔNG DÂN TỰ TRA CỨU (Kết nối bằng User: citizen01 / Mật khẩu: Citizen@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: CITIZEN (citizen01 - Nguyễn Hoàng Long, ID=18) ===' AS Vai_Tro;

-- 1. [BẢO MẬT CẤP DÒNG]: Chỉ tự tra cứu thông tin cá nhân và hồ sơ của chính mình
SELECT * FROM citizen WHERE citizen_id = 18;
SELECT * FROM dossier WHERE citizen_id = 18;


-- 2. [Hàm 5] fn_check_insurance_validity (Tự xác thực thẻ BHYT ưu đãi)
-- [VALID CASE]
SELECT fn_check_insurance_validity(18) AS My_BHYT_Status;


-- 3. [Hàm 3] fn_get_total_monthly_allowance (Tự tra cứu mức trợ cấp)
SELECT fn_get_total_monthly_allowance(18) AS My_Allowance;


-- 4. [KIỂM THỬ BẢO MẬT]: Cố tình xem trộm nhật ký bảo mật audit_log của máy chủ (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "SELECT command denied to user 'citizen01'@'localhost' for table 'audit_log'")
SELECT * FROM audit_log;

