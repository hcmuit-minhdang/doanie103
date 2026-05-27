
-- ==============================================================================
-- 🔍 PHẦN 3: VAI TRÒ KIỂM DUYỆT VIÊN (Kết nối bằng User: reviewer01 / Mật khẩu: Reviewer@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: DOSSIER REVIEWER (reviewer01) ===' AS Vai_Tro;

-- Thiết lập thông tin phiên IP cho Trigger kiểm toán
SET @app_client_ip = '192.168.1.55';

-- 1. [Khung nhìn 3] v_pending_dossiers (Danh sách hồ sơ chờ duyệt)
-- [VALID CASE]
SELECT dossier_id, citizen_name, dossier_type, note FROM v_pending_dossiers LIMIT 5;


-- 2. [Hàm 6] fn_get_latest_dossier_status (Xem trạng thái hồ sơ gần nhất)
SELECT fn_get_latest_dossier_status(13) AS Trang_Thai_Truoc_Duyet;


-- 3. [Thủ tục 1] sp_review_dossier (Phê duyệt hồ sơ chính sách)
-- [VALID CASE]: Thẩm định và duyệt hồ sơ số 13
CALL sp_review_dossier(13, 2, 'approved', 'Hồ sơ đầy đủ chứng nhận thương binh.');

-- Xem thông báo liên thông tự cấp ví tiền từ Trigger 3
SELECT @trigger_msg AS Thong_Bao_Trigger_3;

-- [KIỂM CHỨNG 1]: Xem trạng thái hồ sơ số 13 trong bảng dossier đã chuyển sang 'approved' chưa
SELECT dossier_id, citizen_id, status, reviewed_at, reviewed_by, note 
FROM dossier 
WHERE dossier_id = 13;

-- [KIỂM CHỨNG 2]: Xem nhật ký phê duyệt có lưu vào audit_log qua Trigger 2 chưa
SELECT * FROM audit_log WHERE table_name = 'dossier' AND record_id = 13 ORDER BY audit_log_id DESC LIMIT 1;

-- [KIỂM CHỨNG 3]: Xem ví tiền trợ cấp của công dân ID = 13 đã tự động kích hoạt active chưa
SELECT * FROM citizen_allowance WHERE citizen_id = 13;


-- [INVALID CASE]: Thử duyệt lại hồ sơ đã được chốt trước đó (Hồ sơ ID = 2)
-- (Kỳ vọng: Bị Trigger 1 đóng băng chặn đứng ném lỗi "Ho so da chot, khong duoc phep chinh sua bat ky thong tin nao.")
-- CALL sp_review_dossier(2, 2, 'approved', 'Cố tình duyệt lại');


-- 4. [KIỂM THỬ BẢO MẬT]: Thử chèn ví trực tiếp không qua quy trình nộp duyệt hồ sơ (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "INSERT command denied to user 'reviewer01'@'localhost'")
-- INSERT INTO citizen_allowance (citizen_id, regime_id, start_date) VALUES (1, 1, CURDATE());


