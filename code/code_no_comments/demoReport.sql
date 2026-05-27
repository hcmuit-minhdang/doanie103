USE IE103_db;
SELECT '=== DEMO VAI TRÒ: REPORT VIEWER (report01) ===' AS Vai_Tro;

SELECT province_name, district_name, ward_name, total_beneficiaries, total_monthly_amount FROM v_allowance_summary_by_region LIMIT 5;

SELECT campaign_name, citizen_name, gift_type, gift_value FROM v_visit_gift_history WHERE campaign_year = 2026 LIMIT 5;

CALL sp_get_campaign_summary_report(2);