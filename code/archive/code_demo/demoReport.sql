
-- ==============================================================================
-- 📈 PHẦN 5: VAI TRÒ NGƯỜI XEM BÁO CÁO GIÁM SÁT (Kết nối bằng User: report01 / Mật khẩu: Report@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: REPORT VIEWER (report01) ===' AS Vai_Tro;

-- 1. [Khung nhìn 7] v_allowance_summary_by_region (Thống kê trợ cấp theo khu vực)
-- [VALID CASE]
SELECT province_name, district_name, ward_name, total_beneficiaries, total_monthly_amount FROM v_allowance_summary_by_region LIMIT 5;


-- 2. [Khung nhìn 6] v_visit_gift_history (Lịch sử phát quà tết và chính sách)
SELECT campaign_name, citizen_name, gift_type, gift_value FROM v_visit_gift_history WHERE campaign_year = 2026 LIMIT 5;


-- 3. [Thủ tục 3] sp_get_campaign_summary_report (Kết xuất báo cáo tổng hợp chiến dịch)
-- [VALID CASE]: Báo cáo chiến dịch tết 2026 (ID = 2)
CALL sp_get_campaign_summary_report(2);


-- 4. [KIỂM THỬ BẢO MẬT]: Cố tình truy vấn hồ sơ chi tiết (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "SELECT command denied to user 'report01'@'localhost' for table 'dossier'")
SELECT * FROM dossier;


