USE IE103_db;
SELECT '=== DEMO VAI TRÒ: SYSTEM ADMIN (admin01) ===' AS Vai_Tro;

CALL sp_add_household_member(8, 24, 'Thành viên mới');

SELECT household_id, citizen_id, relation, joined_date 
FROM household_member 
WHERE household_id = 8 AND citizen_id = 24;

CALL sp_transfer_dossier(9, 3, 2);

SELECT dossier_transfer_id, dossier_id, from_agency, to_agency, transfer_date 
FROM dossier_transfer 
WHERE dossier_id = 9 AND from_agency = 3 AND to_agency = 2;

CALL sp_insert_medical_snapshot(1, 'Đã khám định kỳ, sức khỏe ổn định.');

SELECT medical_snapshot_id, citizen_id, health_status, recorded_at 
FROM medical_snapshot 
WHERE citizen_id = 1 
ORDER BY recorded_at DESC LIMIT 1;

SELECT household_code, head_of_household, condition_type FROM v_household_policy_status WHERE policy_type = 'Hộ nghèo' LIMIT 5;

SELECT * FROM v_household_policy_status WHERE household_code = 'HK-00001' AND policy_type = 'Hộ nghèo';

SELECT policy_holder_name, proxy_name, relation, end_date FROM v_active_authorizations LIMIT 5;

SELECT full_name, bank_code, account_number FROM v_citizen_default_bank LIMIT 5;

SELECT ward_name, policy_type, total_citizens FROM v_policy_object_distribution LIMIT 5;