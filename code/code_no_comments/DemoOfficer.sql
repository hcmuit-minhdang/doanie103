USE IE103_db;
SELECT '=== DEMO VAI TRÒ: AGENCY OFFICER (officer01) ===' AS Vai_Tro;

SET @app_client_ip = '192.168.1.55';
SET @current_official_id = 2;

SELECT full_name, cccd_number, regime_name, base_amount FROM v_citizen_active_allowance WHERE ward_name = 'Phường Bến Nghé' LIMIT 5;

SELECT * FROM v_citizen_active_allowance WHERE citizen_id = 24;

SELECT fn_get_full_address('W26300') AS Dia_Chi_Hop_Le;

SELECT fn_get_full_address('P79') AS Dia_Chi_Sai;

SELECT fn_get_total_monthly_allowance(1) AS Tro_Cap_Valid;

SELECT fn_get_total_monthly_allowance(24) AS Tro_Cap_Invalid;

SELECT fn_get_latest_dossier_status(1) AS Trang_Thai_Ho_So;

UPDATE citizen SET address_detail = '88 Lê Lợi, Phường Bến Nghé' WHERE citizen_id = 2;
SELECT @trigger_msg AS Thong_Bao_Trigger_7;

SELECT citizen_id, full_name, address_detail FROM citizen WHERE citizen_id = 2;

SELECT * FROM audit_log WHERE table_name = 'citizen' AND record_id = 2 ORDER BY audit_log_id DESC LIMIT 1;