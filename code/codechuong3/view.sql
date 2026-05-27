use IE103_db;

-- 1. View v_citizen_active_allowance (Danh sách trợ cấp đang hoạt động)
DELIMITER //
CREATE OR REPLACE VIEW v_citizen_active_allowance AS
SELECT
    c.citizen_id,
    c.cccd_number,
    c.full_name,
    c.dob,
    c.gender,
    w.ward_name,
    d.district_name,
    p.province_name,
    ar.regime_name,
    ar.base_amount,
    ca.start_date,
    ca.status AS allowance_status
FROM citizen c
JOIN ward w ON c.ward_id = w.ward_id
JOIN district d ON w.district_id = d.district_id
JOIN province p ON d.province_id = p.province_id
JOIN citizen_allowance ca ON c.citizen_id = ca.citizen_id
JOIN allowance_regime ar ON ca.regime_id = ar.regime_id
WHERE ca.status = 'active' //
DELIMITER ;

-- 2. View v_household_policy_status (Trạng thái chính sách hộ gia đình)
DELIMITER //
CREATE OR REPLACE VIEW v_household_policy_status AS
SELECT
    h.household_id,
    h.household_code,
    c.full_name        AS head_of_household,
    w.ward_name,
    d.district_name,
    po.object_name     AS policy_type,
    lc.condition_type,
    lc.description     AS condition_description
FROM household h
LEFT JOIN citizen c          ON h.head_citizen_id = c.citizen_id
LEFT JOIN ward w             ON h.ward_id = w.ward_id
LEFT JOIN district d         ON w.district_id = d.district_id
LEFT JOIN object_mapping om  ON c.citizen_id = om.citizen_id AND om.status = 'active'
LEFT JOIN policy_object po   ON om.object_id = po.object_id
LEFT JOIN living_condition lc ON h.household_id = lc.household_id //
DELIMITER ;

-- 3. View v_pending_dossiers (Hồ sơ đang chờ duyệt)
DELIMITER //
CREATE OR REPLACE VIEW v_pending_dossiers AS
SELECT
    d.dossier_id,
    c.full_name        AS citizen_name,
    c.cccd_number,
    d.dossier_type,
    d.status,
    d.created_at,
    d.submitted_at,
    d.note
FROM dossier d
JOIN citizen c ON d.citizen_id = c.citizen_id
WHERE d.status = 'submitted' //
DELIMITER ;

-- 4. View v_active_authorizations (Ủy quyền nhận thay có hiệu lực)
DELIMITER //
CREATE OR REPLACE VIEW v_active_authorizations AS
SELECT
    a.authorization_id,
    c1.full_name AS policy_holder_name,
    c2.full_name AS proxy_name,
    a.relation,
    a.document_url,
    a.start_date,
    a.end_date
FROM `authorization` a
JOIN citizen c1 ON a.policy_holder_id = c1.citizen_id
JOIN citizen c2 ON a.proxy_id         = c2.citizen_id
WHERE a.status = 'active'
  AND (a.end_date IS NULL OR a.end_date >= CURDATE()) //
DELIMITER ;

-- 5. View v_citizen_default_bank (Tài khoản ngân hàng nhận trợ cấp)
DELIMITER //
CREATE OR REPLACE VIEW v_citizen_default_bank AS
SELECT
    c.citizen_id,
    c.full_name,
    c.cccd_number,
    b.bank_code,
    b.bank_name,
    ba.account_number,
    ba.account_holder
FROM citizen c
JOIN bank_account ba ON c.citizen_id = ba.citizen_id
JOIN bank b          ON ba.bank_id   = b.bank_id
WHERE ba.is_default = 1 //
DELIMITER ;

-- 6. View v_visit_gift_history (Lịch sử trao quà tết/chính sách)
DELIMITER //
CREATE OR REPLACE VIEW v_visit_gift_history AS
SELECT
    vl.visit_log_id,
    cp.campaign_name,
    cp.`year`          AS campaign_year,
    c.full_name        AS citizen_name,
    c.cccd_number,
    gc.category_name   AS gift_type,
    gc.unit            AS gift_unit,
    vl.`value`         AS gift_value,
    vl.status          AS delivery_status,
    vl.visited_at,
    o.username         AS officer_name
FROM visit_log vl
JOIN campaign cp       ON vl.campaign_id      = cp.campaign_id
JOIN citizen c         ON vl.citizen_id       = c.citizen_id
JOIN gift_category gc  ON vl.gift_category_id = gc.gift_category_id
LEFT JOIN official o   ON vl.officer_id       = o.official_id //
DELIMITER ;

-- 7. View v_allowance_summary_by_region (Tổng hợp trợ cấp theo xã phường)
DELIMITER //
CREATE OR REPLACE VIEW v_allowance_summary_by_region AS
SELECT
    p.province_name,
    d.district_name,
    w.ward_name,
    COUNT(DISTINCT ca.citizen_id)     AS total_beneficiaries,
    IFNULL(SUM(ar.base_amount), 0.00) AS total_monthly_amount
FROM province p
JOIN district d ON p.province_id = d.province_id
JOIN ward w     ON d.district_id = w.district_id
LEFT JOIN citizen c            ON w.ward_id    = c.ward_id
LEFT JOIN citizen_allowance ca ON c.citizen_id = ca.citizen_id AND ca.status = 'active'
LEFT JOIN allowance_regime ar  ON ca.regime_id = ar.regime_id
GROUP BY p.province_name, d.district_name, w.ward_name //
DELIMITER ;

-- 8. View v_policy_object_distribution (Cơ cấu phân bổ nhóm chính sách)
DELIMITER //
CREATE OR REPLACE VIEW v_policy_object_distribution AS
SELECT
    p.province_name,
    d.district_name,	
    w.ward_name,
    po.object_name   AS policy_type,
    COUNT(om.citizen_id) AS total_citizens
FROM province p
JOIN district d     ON p.province_id  = d.province_id
JOIN ward w         ON d.district_id  = w.district_id
JOIN citizen c      ON w.ward_id      = c.ward_id
JOIN object_mapping om  ON c.citizen_id = om.citizen_id AND om.status = 'active'
JOIN policy_object po   ON om.object_id = po.object_id
GROUP BY p.province_name, d.district_name, w.ward_name, po.object_name //
DELIMITER ;

