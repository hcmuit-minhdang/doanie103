
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
SELECT * FROM dossier;

