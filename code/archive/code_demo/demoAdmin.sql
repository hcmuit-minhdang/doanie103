
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

