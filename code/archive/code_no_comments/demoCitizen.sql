USE IE103_db;
SELECT '=== DEMO VAI TRÒ: CITIZEN (citizen01 - Nguyễn Hoàng Long, ID=18) ===' AS Vai_Tro;

SELECT * FROM citizen WHERE citizen_id = 18;
SELECT * FROM dossier WHERE citizen_id = 18;

SELECT fn_check_insurance_validity(18) AS My_BHYT_Status;

SELECT fn_get_total_monthly_allowance(18) AS My_Allowance;