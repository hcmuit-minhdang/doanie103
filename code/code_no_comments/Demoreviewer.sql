USE IE103_db;
SELECT '=== DEMO VAI TRÒ: DOSSIER REVIEWER (reviewer01) ===' AS Vai_Tro;

SET @app_client_ip = '192.168.1.55';

SELECT dossier_id, citizen_name, dossier_type, note FROM v_pending_dossiers LIMIT 5;

SELECT fn_get_latest_dossier_status(13) AS Trang_Thai_Truoc_Duyet;

CALL sp_review_dossier(13, 2, 'approved', 'Hồ sơ đầy đủ chứng nhận thương binh.');

SELECT @trigger_msg AS Thong_Bao_Trigger_3;

SELECT dossier_id, citizen_id, status, reviewed_at, reviewed_by, note 
FROM dossier 
WHERE dossier_id = 13;

SELECT * FROM audit_log WHERE table_name = 'dossier' AND record_id = 13 ORDER BY audit_log_id DESC LIMIT 1;

SELECT * FROM citizen_allowance WHERE citizen_id = 13;