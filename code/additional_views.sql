USE IE103_db;

-- =============================================
-- VIEW 9: Hồ sơ chi tiết kèm thông tin công dân, cán bộ duyệt, và lịch sử luân chuyển
-- Mục đích: Dashboard cán bộ - Xem chi tiết hồ sơ
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_dossier_detail AS
SELECT
    d.dossier_id,
    d.citizen_id,
    c.full_name        AS citizen_name,
    c.cccd_number,
    d.dossier_type,
    d.status,
    d.note,
    d.created_at,
    d.submitted_at,
    d.reviewed_at,
    d.reviewed_by,
    o.username         AS reviewer_name,
    o.role             AS reviewer_role,
    po.object_name     AS policy_type,
    w.ward_name,
    dist.district_name,
    p.province_name
FROM dossier d
JOIN citizen c               ON d.citizen_id = c.citizen_id
LEFT JOIN official o         ON d.reviewed_by = o.official_id
LEFT JOIN object_mapping om  ON c.citizen_id = om.citizen_id AND om.status = 'active'
LEFT JOIN policy_object po   ON om.object_id = po.object_id
LEFT JOIN ward w             ON c.ward_id = w.ward_id
LEFT JOIN district dist      ON w.district_id = dist.district_id
LEFT JOIN province p         ON dist.province_id = p.province_id //
DELIMITER ;

-- =============================================
-- VIEW 10: Tổng hợp chi trả hàng tháng theo khu vực
-- Mục đích: Dashboard cán bộ - Báo cáo chi trả
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_payment_monthly_report AS
SELECT
    p.province_name,
    d.district_name,
    w.ward_name,
    MONTH(ph.payment_date)                                    AS payment_month,
    YEAR(ph.payment_date)                                     AS payment_year,
    COUNT(ph.payment_id)                                      AS total_transactions,
    SUM(CASE WHEN ph.status = 'success' THEN 1 ELSE 0 END)   AS success_count,
    SUM(CASE WHEN ph.status = 'failed' THEN 1 ELSE 0 END)    AS failed_count,
    IFNULL(SUM(CASE WHEN ph.status = 'success' THEN ph.amount ELSE 0 END), 0) AS total_paid,
    IFNULL(SUM(CASE WHEN ph.status = 'failed' THEN ph.amount ELSE 0 END), 0)  AS total_failed_amount
FROM payment_history ph
JOIN citizen c        ON ph.citizen_id = c.citizen_id
LEFT JOIN ward w      ON c.ward_id = w.ward_id
LEFT JOIN district d  ON w.district_id = d.district_id
LEFT JOIN province p  ON d.province_id = p.province_id
GROUP BY p.province_name, d.district_name, w.ward_name,
         YEAR(ph.payment_date), MONTH(ph.payment_date) //
DELIMITER ;

-- =============================================
-- VIEW 11: Thống kê phản ánh kiến nghị theo trạng thái + thời gian
-- Mục đích: Dashboard cán bộ - Trang xử lý phản ánh kiến nghị
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_feedback_detail AS
SELECT
    ft.feedback_ticket_id,
    ft.citizen_id,
    c.full_name    AS citizen_name,
    c.cccd_number,
    ft.title,
    ft.content,
    ft.reply,
    ft.status,
    ft.created_at,
    ft.resolved_at,
    ft.resolved_by,
    o.username     AS resolver_name,
    CASE 
        WHEN ft.resolved_at IS NOT NULL 
        THEN TIMESTAMPDIFF(HOUR, ft.created_at, ft.resolved_at)
        ELSE TIMESTAMPDIFF(HOUR, ft.created_at, NOW())
    END AS hours_elapsed,
    w.ward_name,
    d.district_name,
    p.province_name
FROM feedback_ticket ft
JOIN citizen c         ON ft.citizen_id = c.citizen_id
LEFT JOIN official o   ON ft.resolved_by = o.official_id
LEFT JOIN ward w       ON c.ward_id = w.ward_id
LEFT JOIN district d   ON w.district_id = d.district_id
LEFT JOIN province p   ON d.province_id = p.province_id //
DELIMITER ;

-- =============================================
-- VIEW 12: Hồ sơ công dân đầy đủ (profile) - gộp tất cả thông tin liên quan
-- Mục đích: API tra cứu thông tin công dân - 1 query lấy toàn bộ
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_citizen_full_profile AS
SELECT
    c.citizen_id,
    c.cccd_number,
    c.full_name,
    c.dob,
    TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) AS age,
    c.gender,
    c.address_detail,
    w.ward_name,
    d.district_name,
    p.province_name,
    CONCAT(w.ward_name, ', ', d.district_name, ', ', p.province_name) AS full_address,
    po.object_name     AS policy_type,
    om.status          AS policy_status,
    ar.regime_name,
    ar.base_amount     AS monthly_allowance,
    ca.status          AS allowance_status,
    hi.insurance_code,
    hi.benefit_level,
    hi.hospital_code,
    ba.account_number  AS default_bank_account,
    b.bank_name        AS default_bank,
    h.household_code,
    hm.relation        AS household_relation
FROM citizen c
LEFT JOIN ward w                ON c.ward_id = w.ward_id
LEFT JOIN district d            ON w.district_id = d.district_id
LEFT JOIN province p            ON d.province_id = p.province_id
LEFT JOIN object_mapping om     ON c.citizen_id = om.citizen_id AND om.status = 'active'
LEFT JOIN policy_object po      ON om.object_id = po.object_id
LEFT JOIN citizen_allowance ca  ON c.citizen_id = ca.citizen_id AND ca.status = 'active'
LEFT JOIN allowance_regime ar   ON ca.regime_id = ar.regime_id
LEFT JOIN health_insurance hi   ON c.citizen_id = hi.citizen_id
LEFT JOIN bank_account ba       ON c.citizen_id = ba.citizen_id AND ba.is_default = 1
LEFT JOIN bank b                ON ba.bank_id = b.bank_id
LEFT JOIN household_member hm   ON c.citizen_id = hm.citizen_id
LEFT JOIN household h           ON hm.household_id = h.household_id //
DELIMITER ;

-- =============================================
-- VIEW 13: Danh sách ủy quyền đầy đủ (bao gồm cả expired/revoked)
-- Mục đích: Dashboard cán bộ - Quản lý giấy ủy quyền (filter theo status)
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_authorization_full AS
SELECT
    a.authorization_id,
    a.policy_holder_id,
    c1.full_name       AS policy_holder_name,
    c1.cccd_number     AS policy_holder_cccd,
    a.proxy_id,
    c2.full_name       AS proxy_name,
    c2.cccd_number     AS proxy_cccd,
    a.relation,
    a.document_url,
    a.start_date,
    a.end_date,
    a.status,
    CASE
        WHEN a.status = 'active' AND a.end_date < CURDATE() THEN 'Sắp hết hạn'
        WHEN a.status = 'active' THEN 'Đang hiệu lực'
        WHEN a.status = 'expired' THEN 'Đã hết hạn'
        WHEN a.status = 'revoked' THEN 'Đã thu hồi'
    END AS status_label,
    DATEDIFF(a.end_date, CURDATE()) AS days_remaining
FROM `authorization` a
JOIN citizen c1 ON a.policy_holder_id = c1.citizen_id
JOIN citizen c2 ON a.proxy_id = c2.citizen_id //
DELIMITER ;

-- =============================================
-- VIEW 14: Nhật ký kiểm toán chi tiết (kèm tên cán bộ)
-- Mục đích: Dashboard cán bộ - Quản trị hệ thống & Giám sát
-- =============================================
DELIMITER //
CREATE OR REPLACE VIEW v_audit_log_detail AS
SELECT
    al.audit_log_id,
    al.official_id,
    IFNULL(o.username, 'system_auto') AS official_name,
    IFNULL(o.role, 'Hệ thống')       AS official_role,
    al.action,
    al.table_name,
    al.record_id,
    al.old_data,
    al.new_data,
    al.ip_address,
    al.created_at,
    CASE al.action
        WHEN 'INSERT' THEN 'Thêm mới'
        WHEN 'UPDATE' THEN 'Cập nhật'
        WHEN 'DELETE' THEN 'Xóa'
        ELSE al.action
    END AS action_label
FROM audit_log al
LEFT JOIN official o ON al.official_id = o.official_id //
DELIMITER ;
