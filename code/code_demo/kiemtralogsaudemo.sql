-- ==============================================================================
-- 👑 PHẦN 7: ADMIN ĐỐI CHIẾU KIỂM TOÁN SAU BUỔI DEMO (Quay lại tab: admin01 / root)
-- ==============================================================================
USE IE103_db;
SELECT '=== ĐỐI CHIẾU KIỂM TOÁN HỆ THỐNG SAU DEMO (Root) ===' AS Thong_Bao;

-- Truy xuất log kiểm toán để thấy rõ các vết hành động tự động sinh ra trong buổi demo
SELECT * FROM audit_log ORDER BY audit_log_id DESC LIMIT 5;
