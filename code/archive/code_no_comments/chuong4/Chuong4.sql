USE IE103_db;
SELECT '=== KHỞI TẠO USER/ROLE VÀ PHÂN QUYỀN CHƯƠNG 4 ===' AS Tien_Trinh;

CREATE ROLE IF NOT EXISTS 'admin_role';
CREATE ROLE IF NOT EXISTS 'agency_officer_role';
CREATE ROLE IF NOT EXISTS 'reviewer_role';
CREATE ROLE IF NOT EXISTS 'citizen_service_role';
CREATE ROLE IF NOT EXISTS 'report_viewer_role';
CREATE ROLE IF NOT EXISTS 'citizen_role';

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

GRANT 'admin_role' TO 'admin01'@'localhost';
GRANT 'agency_officer_role' TO 'officer01'@'localhost', 'officer02'@'localhost', 'officer03'@'localhost';
GRANT 'reviewer_role' TO 'reviewer01'@'localhost', 'reviewer02'@'localhost';
GRANT 'citizen_service_role' TO 'service01'@'localhost', 'service02'@'localhost';
GRANT 'report_viewer_role' TO 'report01'@'localhost';
GRANT 'citizen_role' TO 'citizen01'@'localhost', 'citizen02'@'localhost', 'citizen03'@'localhost';

SET DEFAULT ROLE 'admin_role' TO 'admin01'@'localhost';
SET DEFAULT ROLE 'agency_officer_role' TO 'officer01'@'localhost', 'officer02'@'localhost', 'officer03'@'localhost';
SET DEFAULT ROLE 'reviewer_role' TO 'reviewer01'@'localhost', 'reviewer02'@'localhost';
SET DEFAULT ROLE 'citizen_service_role' TO 'service01'@'localhost', 'service02'@'localhost';
SET DEFAULT ROLE 'report_viewer_role' TO 'report01'@'localhost';
SET DEFAULT ROLE 'citizen_role' TO 'citizen01'@'localhost', 'citizen02'@'localhost', 'citizen03'@'localhost';

GRANT ALL PRIVILEGES ON IE103_db.* TO 'admin_role';

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

GRANT SELECT ON IE103_db.citizen TO 'reviewer_role';
GRANT SELECT, UPDATE ON IE103_db.dossier TO 'reviewer_role';
GRANT SELECT ON IE103_db.attachment TO 'reviewer_role';
GRANT SELECT ON IE103_db.v_pending_dossiers TO 'reviewer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_review_dossier TO 'reviewer_role';
GRANT EXECUTE ON FUNCTION IE103_db.fn_get_latest_dossier_status TO 'reviewer_role';

GRANT SELECT ON IE103_db.citizen TO 'citizen_service_role';
GRANT SELECT, UPDATE ON IE103_db.feedback_ticket TO 'citizen_service_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_resolve_feedback TO 'citizen_service_role';

GRANT SELECT ON IE103_db.v_citizen_active_allowance TO 'report_viewer_role';
GRANT SELECT ON IE103_db.v_visit_gift_history TO 'report_viewer_role';
GRANT SELECT ON IE103_db.v_allowance_summary_by_region TO 'report_viewer_role';
GRANT EXECUTE ON PROCEDURE IE103_db.sp_get_campaign_summary_report TO 'report_viewer_role';

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