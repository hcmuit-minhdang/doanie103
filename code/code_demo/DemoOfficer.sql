
-- ==============================================================================
-- 💼 PHẦN 2: VAI TRÒ CÁN BỘ XỬ LÝ (Kết nối bằng User: officer01 / Mật khẩu: Officer@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: AGENCY OFFICER (officer01) ===' AS Vai_Tro;

-- Thiết lập thông tin phiên cho Trigger kiểm toán
SET @app_client_ip = '192.168.1.55';
SET @current_official_id = 2;

-- 1. [Khung nhìn 1] v_citizen_active_allowance (Xem danh sách trợ cấp đang hoạt động)
-- [VALID CASE]: Tìm kiếm đối tượng nhận trợ cấp tại Phường Bến Nghé
SELECT full_name, cccd_number, regime_name, base_amount FROM v_citizen_active_allowance WHERE ward_name = 'Phường Bến Nghé' LIMIT 5;

-- [INVALID CASE]: Lọc công dân ID = 24 (không hưởng trợ cấp nào)
SELECT * FROM v_citizen_active_allowance WHERE citizen_id = 24;


-- 2. [Hàm 1] fn_get_full_address (Ghép địa chỉ 3 cấp từ mã Phường)
-- [VALID CASE]: Mã phường Bến Nghé W26300
SELECT fn_get_full_address('W26300') AS Dia_Chi_Hop_Le;

-- [INVALID CASE]: Truyền mã Tỉnh 'P79' vào cấp Phường
SELECT fn_get_full_address('P79') AS Dia_Chi_Sai;


-- 3. [Hàm 3] fn_get_total_monthly_allowance (Tính tổng tiền trợ cấp hàng tháng)
-- [VALID CASE]: Thương binh ID = 1
SELECT fn_get_total_monthly_allowance(1) AS Tro_Cap_Valid;

-- [INVALID CASE]: Người thường ID = 24
SELECT fn_get_total_monthly_allowance(24) AS Tro_Cap_Invalid;


-- 4. [Hàm 6] fn_get_latest_dossier_status (Kiểm tra trạng thái hồ sơ gần nhất)
SELECT fn_get_latest_dossier_status(1) AS Trang_Thai_Ho_So;


-- 5. [Trigger 7] tg_audit_citizen_changes (Tự động ghi audit log thông tin nhạy cảm)
-- [VALID CASE]: Cán bộ sửa địa chỉ công dân ID = 2 -> Trigger 7 tự sinh log kiểm toán định dạng JSON
UPDATE citizen SET address_detail = '88 Lê Lợi, Phường Bến Nghé' WHERE citizen_id = 2;
SELECT @trigger_msg AS Thong_Bao_Trigger_7;

-- [KIỂM CHỨNG 1]: Xem bảng dữ liệu citizen xem địa chỉ của ID = 2 đã đổi thành công chưa
SELECT citizen_id, full_name, address_detail FROM citizen WHERE citizen_id = 2;

-- [KIỂM CHỨNG 2]: Xem dòng log kiểm toán vừa tự sinh trong audit_log
SELECT * FROM audit_log WHERE table_name = 'citizen' AND record_id = 2 ORDER BY audit_log_id DESC LIMIT 1;

-- [INVALID CASE]: Sửa CCCD của công dân thành '123' (Sai định dạng - vi phạm ràng buộc CHECK)
-- (Kỳ vọng: Bị database chặn ném lỗi "Check constraint 'chk_cccd_format' is violated")
UPDATE citizen SET cccd_number = '123' WHERE citizen_id = 2;


-- 6. [Trigger 4 & 5] trg_allowance_need_policy (Chặn cấp trợ cấp khống khi chưa có chính sách)
-- [INVALID CASE]: Cố tình chèn ví trợ cấp Thương Binh cho người thường ID = 24
-- (Kỳ vọng: Bị Trigger 4 chặn ném lỗi "Cong dan chua co dien chinh sach active.")
INSERT INTO citizen_allowance (citizen_id, regime_id, start_date, status) VALUES (24, 1, CURDATE(), 'active');


-- 7. [KIỂM THỬ BẢO MẬT]: Cố tình chạy thủ tục Duyệt hồ sơ của cấp Sở (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "execute command denied to user 'officer01'@'localhost' for routine 'sp_review_dossier'")
CALL sp_review_dossier(7, 2, 'approved', 'Cố duyệt khống');

