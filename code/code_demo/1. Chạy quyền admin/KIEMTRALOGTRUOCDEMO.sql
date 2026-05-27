use IE103_db;
-- Xem tổng số log ban đầu
SELECT COUNT(*) AS Tong_So_Log_Ban_Dau FROM audit_log;
-- Xem danh sách log hiện tại (chưa hề có vết của officer01 và reviewer01)
SELECT * FROM audit_log ORDER BY audit_log_id DESC LIMIT 5;