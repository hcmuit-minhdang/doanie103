-- ==============================================================================
-- 📊 HỆ THỐNG AN SINH XÃ HỘI & ĐỐI TƯỢNG CHÍNH SÁCH (CSDL: IE103_db)
-- 🎬 FILE KỊCH BẢN CHẠY DEMO TÍCH HỢP LIÊN KẾT CHƯƠNG 3 & CHƯƠNG 4
-- ==============================================================================
-- Hướng dẫn: Bạn mở tệp này trong MySQL Workbench. Sau đó copy hoặc chạy 
-- từng khối lệnh tại tab kết nối của User tương ứng để quay video demo.
-- ==============================================================================

-- ==============================================================================
-- 🔌 PHẦN 0: KHỞI TẠO CƠ SỞ DỮ LIỆU SẠCH (Chạy duy nhất 1 lần bằng tài khoản ROOT)
-- ==============================================================================
-- Bước 0.1: Bạn mở và chạy lần lượt 6 tệp SQL sau để reset cấu trúc & nạp dữ liệu:
--
-- 1. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\createTable.sql
--    (Tác vụ: Reset sạch cấu trúc bảng)
--
-- 2. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\insertMockData.sql
--    (Tác vụ: Nạp dữ liệu mẫu sạch chuẩn hóa)
--
-- 3. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\codechuong3\view.sql
--    (Tác vụ: Nạp cấu trúc 8 Views Chương 3)
--
-- 4. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\codechuong3\HAM.sql
--    (Tác vụ: Nạp cấu trúc 6 Functions Chương 3)
--
-- 5. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\codechuong3\thutuc.sql
--    (Tác vụ: Nạp cấu trúc 6 Stored Procedures Chương 3)
--
-- 6. Mở & chạy file: c:\Users\dangm\OneDrive\Desktop\code\codechuong3\trigger (1).sql
--    (Tác vụ: Nạp cấu trúc 7 Triggers chuyên sâu Chương 3)
--
-- ==============================================================================
-- Bước 0.2: Thực thi đoạn mã dưới đây (bôi đen toàn bộ Phần 0.2 này và chạy bằng ROOT)
-- để tự động tạo vai trò, người dùng, reset mật khẩu sạch và cấp quyền Chương 4:
-- ==============================================================================

USE IE103_db;
SELECT '=== KHỞI TẠO USER/ROLE VÀ PHÂN QUYỀN CHƯƠNG 4 ===' AS Tien_Trinh;

-- 1. TẠO CÁC VAI TRÒ (ROLES)
CREATE ROLE IF NOT EXISTS 'admin_role';
CREATE ROLE IF NOT EXISTS 'agency_officer_role';
CREATE ROLE IF NOT EXISTS 'reviewer_role';
CREATE ROLE IF NOT EXISTS 'citizen_service_role';
CREATE ROLE IF NOT EXISTS 'report_viewer_role';
CREATE ROLE IF NOT EXISTS 'citizen_role';

-- 2. TẠO TÀI KHOẢN NGƯỜI DÙNG (USERS)
CREATE USER IF NOT EXISTS 'admin01'@'localhost' IDENTIFIED BY 'Admin@123';
CREATE USER IF NOT EXISTS 'officer01'@'localhost' IDENTIFIED BY 'Officer@123';
CREATE USER IF NOT EXISTS 'officer02'@'localhost' IDENTIFIED BY 'Officer@123';
CREATE USER IF NOT EXISTS 'officer03'@'localhost' IDENTIFIED BY 'Officer@123';
CREATE USER IF NOT EXISTS 'reviewer01'@'localhost' IDENTIFIED BY 'Reviewer@123';
CREATE USER IF NOT EXISTS 'reviewer02'@'localhost' IDENTIFIED BY 'Reviewer@123';
CREATE USER IF NOT EXISTS 'service01'@'localhost' IDENTIFIED BY 'Service@123';
CREATE USER IF NOT EXISTS 'service02'@'localhost' IDENTIFIED BY 'Service@123';
CREATE USER IF NOT EXISTS 'report01'@'localhost' IDENTIFIED BY 'Report@123';
CREATE USER IF NOT EXISTS 'citizen01'@'localhost' IDENTIFIED BY 'Citizen@123';
CREATE USER IF NOT EXISTS 'citizen02'@'localhost' IDENTIFIED BY 'Citizen@123';
CREATE USER IF NOT EXISTS 'citizen03'@'localhost' IDENTIFIED BY 'Citizen@123';

-- 3. CƯỠNG CHẾ CẬP NHẬT LẠI MẬT KHẨU CHUẨN (ALTER USER)
-- (Đảm bảo ghi đè các mật khẩu cũ đã tồn tại trên máy của bạn để tránh lỗi Access Denied)
ALTER USER 'admin01'@'localhost' IDENTIFIED BY 'Admin@123';
ALTER USER 'officer01'@'localhost' IDENTIFIED BY 'Officer@123';
ALTER USER 'officer02'@'localhost' IDENTIFIED BY 'Officer@123';
ALTER USER 'officer03'@'localhost' IDENTIFIED BY 'Officer@123';
ALTER USER 'reviewer01'@'localhost' IDENTIFIED BY 'Reviewer@123';
ALTER USER 'reviewer02'@'localhost' IDENTIFIED BY 'Reviewer@123';
ALTER USER 'service01'@'localhost' IDENTIFIED BY 'Service@123';
ALTER USER 'service02'@'localhost' IDENTIFIED BY 'Service@123';
ALTER USER 'report01'@'localhost' IDENTIFIED BY 'Report@123';
ALTER USER 'citizen01'@'localhost' IDENTIFIED BY 'Citizen@123';
ALTER USER 'citizen02'@'localhost' IDENTIFIED BY 'Citizen@123';
ALTER USER 'citizen03'@'localhost' IDENTIFIED BY 'Citizen@123';

-- 4. GÁN NGƯỜI DÙNG VÀO VAI TRÒ
GRANT 'admin_role' TO 'admin01'@'localhost';
GRANT 'agency_officer_role' TO 'officer01'@'localhost', 'officer02'@'localhost', 'officer03'@'localhost';
GRANT 'reviewer_role' TO 'reviewer01'@'localhost', 'reviewer02'@'localhost';
GRANT 'citizen_service_role' TO 'service01'@'localhost', 'service02'@'localhost';
GRANT 'report_viewer_role' TO 'report01'@'localhost';
GRANT 'citizen_role' TO 'citizen01'@'localhost', 'citizen02'@'localhost', 'citizen03'@'localhost';

-- 5. THIẾT LẬP VAI TRÒ MẶC ĐỊNH
SET DEFAULT ROLE 'admin_role' TO 'admin01'@'localhost';
SET DEFAULT ROLE 'agency_officer_role' TO 'officer01'@'localhost', 'officer02'@'localhost', 'officer03'@'localhost';
SET DEFAULT ROLE 'reviewer_role' TO 'reviewer01'@'localhost', 'reviewer02'@'localhost';
SET DEFAULT ROLE 'citizen_service_role' TO 'service01'@'localhost', 'service02'@'localhost';
SET DEFAULT ROLE 'report_viewer_role' TO 'report01'@'localhost';
SET DEFAULT ROLE 'citizen_role' TO 'citizen01'@'localhost', 'citizen02'@'localhost', 'citizen03'@'localhost';

-- ==============================================================================
-- 6. PHÂN QUYỀN TRUY CẬP (PRIVILEGES) CHO CÁC ROLE CHƯƠNG 4
-- ==============================================================================
-- 6.1. Phân quyền cho vai trò quản trị viên
GRANT ALL PRIVILEGES ON IE103_db.* TO 'admin_role';

-- 6.2. Phân quyền cho vai trò cán bộ xử lý dữ liệu (Cấp thêm quyền chạy thủ tục và hàm tính tuổi)
GRANT SELECT, INSERT, UPDATE ON IE103_db.citizen TO 'agency_officer_role';
GRANT SELECT, INSERT, UPDATE ON IE103_db.dossier TO 'agency_officer_role';
GRANT SELECT, INSERT, UPDATE ON IE103_db.attachment TO 'agency_officer_role';
GRANT SELECT, INSERT, UPDATE ON IE103_db.object_mapping TO 'agency_officer_role';
GRANT SELECT, INSERT, UPDATE ON IE103_db.citizen_allowance TO 'agency_officer_role';
GRANT SELECT ON IE103_db.v_citizen_active_allowance TO 'agency_officer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_full_address TO 'agency_officer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_total_monthly_allowance TO 'agency_officer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_latest_dossier_status TO 'agency_officer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_calculate_age TO 'agency_officer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_add_household_member TO 'agency_officer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_transfer_dossier TO 'agency_officer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_insert_medical_snapshot TO 'agency_officer_role';

-- 6.3. Phân quyền cho vai trò nhân viên kiểm duyệt
GRANT SELECT ON IE103_db.citizen TO 'reviewer_role';
GRANT SELECT, UPDATE ON IE103_db.dossier TO 'reviewer_role';
GRANT SELECT ON IE103_db.attachment TO 'reviewer_role';
GRANT SELECT ON IE103_db.v_pending_dossiers TO 'reviewer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_review_dossier TO 'reviewer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_latest_dossier_status TO 'reviewer_role';

-- 6.4. Phân quyền cho vai trò nhân viên hỗ trợ công dân
GRANT SELECT ON IE103_db.citizen TO 'citizen_service_role';
GRANT SELECT, UPDATE ON IE103_db.feedback_ticket TO 'citizen_service_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_resolve_feedback TO 'citizen_service_role';

-- 6.5. Phân quyền cho vai trò người xem báo cáo
GRANT SELECT ON IE103_db.v_citizen_active_allowance TO 'report_viewer_role';
GRANT SELECT ON IE103_db.v_visit_gift_history TO 'report_viewer_role';
GRANT SELECT ON IE103_db.v_allowance_summary_by_region TO 'report_viewer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_get_campaign_summary_report TO 'report_viewer_role';

-- 6.6. Phân quyền cho vai trò công dân (Cấp thêm quyền chạy hàm tính tuổi)
GRANT SELECT ON IE103_db.citizen TO 'citizen_role';
GRANT SELECT ON IE103_db.dossier TO 'citizen_role';
GRANT SELECT, INSERT ON IE103_db.feedback_ticket TO 'citizen_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_full_address TO 'citizen_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_total_monthly_allowance TO 'citizen_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_check_insurance_validity TO 'citizen_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_latest_dossier_status TO 'citizen_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_calculate_age TO 'citizen_role';

FLUSH PRIVILEGES;
SELECT '=== HOÀN TẤT SETUP CHƯƠNG 4 - HỆ THỐNG SẴN SÀNG ===' AS Tien_Trinh;

-- ==============================================================================
-- Sau khi chạy xong Phần 0 (gồm cả nạp bảng, data và code Chương 4 ở trên),
-- hệ thống đã sẵn sàng 100%! Bạn có thể đăng nhập các user và chạy các phần dưới:
-- ==============================================================================


-- ==============================================================================
-- 👑 PHẦN 1: VAI TRÒ SYSTEM ADMIN (Kết nối bằng User: admin01 / Mật khẩu: Admin@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: SYSTEM ADMIN (admin01) ===' AS Vai_Tro;

-- 1. [Thủ tục 2] sp_add_household_member (Thêm nhân khẩu vào hộ)
-- [VALID CASE]: Thêm công dân tự do ID = 24 vào hộ gia đình ID = 8
CALL sp_add_household_member(8, 24, 'Thành viên mới');

-- [KIỂM CHỨNG]: Truy vấn bảng household_member xem công dân ID = 24 đã nằm trong hộ ID = 8 chưa
SELECT household_id, citizen_id, relation, joined_date 
FROM household_member 
WHERE household_id = 8 AND citizen_id = 24;

-- [INVALID CASE]: Thêm công dân ID = 1 (đã có hộ khẩu ở sổ khác) vào hộ ID = 5
-- (Kỳ vọng: Bị thủ tục chặn ném lỗi "Lỗi: Công dân đã thuộc một hộ gia đình khác!")
-- CALL sp_add_household_member(5, 1, 'Cháu ruột');


-- 2. [Thủ tục 4] sp_transfer_dossier (Luân chuyển hồ sơ giữa hai cơ quan)
-- [VALID CASE]: Chuyển hồ sơ 9 từ cơ quan nguồn 3 sang cơ quan đích 2
CALL sp_transfer_dossier(9, 3, 2);

-- [KIỂM CHỨNG]: Truy vấn bảng dossier_transfer xem hồ sơ số 9 đã có lịch sử chuyển từ 3 sang 2 chưa
SELECT dossier_transfer_id, dossier_id, from_agency, to_agency, transfer_date 
FROM dossier_transfer 
WHERE dossier_id = 9 AND from_agency = 3 AND to_agency = 2;

-- [INVALID CASE]: Truyền mã cơ quan nguồn không tồn tại (sử dụng ID công dân 24)
-- (Kỳ vọng: Bị kiểm tra sự tồn tại chặn ném lỗi "Lỗi: Cơ quan chuyển giao nguồn không tồn tại!")
-- CALL sp_transfer_dossier(9, 24, 2);


-- 3. [Thủ tục 6] sp_insert_medical_snapshot (Ghi nhận bệnh án y tế mới)
-- [VALID CASE]: Ghi nhận trạng thái sức khỏe của công dân ID = 1
CALL sp_insert_medical_snapshot(1, 'Đã khám định kỳ, sức khỏe ổn định.');

-- [KIỂM CHỨNG]: Truy vấn bảng medical_snapshot xem bệnh án mới nhất của công dân ID = 1
SELECT medical_snapshot_id, citizen_id, health_status, recorded_at 
FROM medical_snapshot 
WHERE citizen_id = 1 
ORDER BY recorded_at DESC LIMIT 1;

-- [INVALID CASE]: Truyền mã công dân không tồn tại trên hệ thống (ID = 30)
-- (Kỳ vọng: Bị chặn ném lỗi "Lỗi: Công dân không tồn tại trên hệ thống!")
-- CALL sp_insert_medical_snapshot(30, 'Bệnh án lỗi');


-- 4. [Khung nhìn 2] v_household_policy_status (Xem trạng thái diện chính sách của hộ)
-- [VALID CASE]: Xem danh sách hộ nghèo thực tế
SELECT household_code, head_of_household, condition_type FROM v_household_policy_status WHERE policy_type = 'Hộ nghèo' LIMIT 5;

-- [INVALID CASE]: Tìm hộ HK-00001 dưới diện chính sách nghèo (Không khớp - trả về rỗng)
SELECT * FROM v_household_policy_status WHERE household_code = 'HK-00001' AND policy_type = 'Hộ nghèo';


-- 5. [Khung nhìn 4] v_active_authorizations (Xem ủy quyền đang có hiệu lực)
SELECT policy_holder_name, proxy_name, relation, end_date FROM v_active_authorizations LIMIT 5;


-- 6. [Khung nhìn 5] v_citizen_default_bank (Xem tài khoản nhận tiền mặc định)
SELECT full_name, bank_code, account_number FROM v_citizen_default_bank LIMIT 5;


-- 7. [Khung nhìn 8] v_policy_object_distribution (Xem phân bổ địa bàn theo diện chính sách)
SELECT ward_name, policy_type, total_citizens FROM v_policy_object_distribution LIMIT 5;



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
-- UPDATE citizen SET cccd_number = '123' WHERE citizen_id = 2;


-- 6. [Trigger 4 & 5] trg_allowance_need_policy (Chặn cấp trợ cấp khống khi chưa có chính sách)
-- [INVALID CASE]: Cố tình chèn ví trợ cấp Thương Binh cho người thường ID = 24
-- (Kỳ vọng: Bị Trigger 4 chặn ném lỗi "Cong dan chua co dien chinh sach active.")
-- INSERT INTO citizen_allowance (citizen_id, regime_id, start_date, status) VALUES (24, 1, CURDATE(), 'active');


-- 7. [KIỂM THỬ BẢO MẬT]: Cố tình chạy thủ tục Duyệt hồ sơ của cấp Sở (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "execute command denied to user 'officer01'@'localhost' for routine 'sp_review_dossier'")
-- CALL sp_review_dossier(7, 2, 'approved', 'Cố duyệt khống');



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



-- ==============================================================================
-- 🤝 PHẦN 4: VAI TRÒ HỖ TRỢ DỊCH VỤ CÔNG (Kết nối bằng User: service01 / Mật khẩu: Service@123)
-- ==============================================================================
USE IE103_db;
SELECT '=== DEMO VAI TRÒ: CITIZEN SERVICE (service01) ===' AS Vai_Tro;

-- 1. [Thủ tục 5] sp_resolve_feedback (Giải quyết ý kiến phản hồi của công dân)
-- [VALID CASE]: Phản hồi phiếu phản ánh số 2
CALL sp_resolve_feedback(2, 4, 'Đã cử tổ công tác xã hội xuống khảo sát mức độ thiệt hại thực tế.');

-- [KIỂM CHỨNG]: Truy vấn bảng feedback_ticket xem phản hồi đã được cập nhật thành công chưa
SELECT feedback_ticket_id, citizen_id, reply, status, resolved_by, resolved_at 
FROM feedback_ticket 
WHERE feedback_ticket_id = 2;


-- 2. [KIỂM THỬ BẢO MẬT]: Cố tình xem trộm hồ sơ cá nhân của người dân (Bị Cấm)
-- (Kỳ vọng: Lỗi chặn phân quyền "SELECT command denied to user 'service01'@'localhost' for table 'dossier'")
-- SELECT * FROM dossier;



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
-- SELECT * FROM dossier;



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
-- SELECT * FROM audit_log;



-- ==============================================================================
-- 👑 PHẦN 7: ADMIN ĐỐI CHIẾU KIỂM TOÁN SAU BUỔI DEMO (Quay lại tab: admin01 / root)
-- ==============================================================================
USE IE103_db;
SELECT '=== ĐỐI CHIẾU KIỂM TOÁN HỆ THỐNG SAU DEMO (Root) ===' AS Thong_Bao;

-- Truy xuất log kiểm toán để thấy rõ các vết hành động tự động sinh ra trong buổi demo
SELECT * FROM audit_log ORDER BY audit_log_id DESC LIMIT 5;
