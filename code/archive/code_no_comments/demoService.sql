USE IE103_db;
SELECT '=== DEMO VAI TRÒ: CITIZEN SERVICE (service01) ===' AS Vai_Tro;

CALL sp_resolve_feedback(2, 4, 'Đã cử tổ công tác xã hội xuống khảo sát mức độ thiệt hại thực tế.');

SELECT feedback_ticket_id, citizen_id, reply, status, resolved_by, resolved_at 
FROM feedback_ticket 
WHERE feedback_ticket_id = 2;