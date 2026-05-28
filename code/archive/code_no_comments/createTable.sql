CREATE DATABASE IE103_db;
USE IE103_db;

CREATE TABLE province (
    province_id   VARCHAR(10) PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL
);

CREATE TABLE district (
    district_id   VARCHAR(10) PRIMARY KEY,
    province_id   VARCHAR(10) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (province_id) REFERENCES province(province_id)
);

CREATE TABLE ward (
    ward_id     VARCHAR(10) PRIMARY KEY,
    district_id VARCHAR(10) NOT NULL,
    ward_name   VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);

CREATE TABLE citizen (
    citizen_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cccd_number       VARCHAR(12) UNIQUE,
    full_name         VARCHAR(100) NOT NULL,
    dob               DATE,
    gender            ENUM('M','F','O'),
    ward_id           VARCHAR(10),
    address_detail    VARCHAR(255),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE SET NULL,
    CONSTRAINT chk_cccd_format CHECK (cccd_number REGEXP '^[0-9]{12}$')
);

CREATE TABLE policy_object (
    object_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    object_name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE object_mapping (
    citizen_id INT UNSIGNED,
    object_id  INT UNSIGNED,
    start_date DATE,
    end_date   DATE,
    status     ENUM('active','expired','paused'),
    PRIMARY KEY (citizen_id, object_id),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id)      ON DELETE CASCADE,
    FOREIGN KEY (object_id)  REFERENCES policy_object(object_id) ON DELETE CASCADE
);

CREATE TABLE bank (
    bank_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bank_code VARCHAR(20) UNIQUE NOT NULL,
    bank_name VARCHAR(200) NOT NULL
);

CREATE TABLE bank_account (
    bank_account_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id      INT UNSIGNED NOT NULL,
    bank_id         INT UNSIGNED NOT NULL,
    account_number  VARCHAR(30) NOT NULL,
    account_holder  VARCHAR(100),
    is_default      BOOLEAN DEFAULT 0,
    UNIQUE (bank_id, account_number),
    INDEX (citizen_id),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id) ON DELETE CASCADE,
    FOREIGN KEY (bank_id)    REFERENCES bank(bank_id)
);

CREATE TABLE health_insurance (
    health_insurance_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id          INT UNSIGNED NOT NULL UNIQUE,
    insurance_code      VARCHAR(15),
    benefit_level       INT,
    hospital_code       VARCHAR(100),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id) ON DELETE CASCADE,
    CONSTRAINT chk_insurance_code CHECK (LENGTH(insurance_code) >= 10)
);

CREATE TABLE medical_snapshot (
    medical_snapshot_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id          INT UNSIGNED NOT NULL,
    health_status       TEXT,
    recorded_at         DATETIME,
    INDEX (citizen_id),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id) ON DELETE CASCADE
);

CREATE TABLE household (
    household_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    household_code  VARCHAR(20) UNIQUE,
    head_citizen_id INT UNSIGNED,
    ward_id         VARCHAR(10),
    address_detail  VARCHAR(255),
    FOREIGN KEY (head_citizen_id) REFERENCES citizen(citizen_id) ON DELETE SET NULL,
    FOREIGN KEY (ward_id)         REFERENCES ward(ward_id)       ON DELETE SET NULL
);

CREATE TABLE household_member (
    household_id INT UNSIGNED NOT NULL,
    citizen_id   INT UNSIGNED NOT NULL UNIQUE,
    relation     VARCHAR(50),
    joined_date  DATE,
    PRIMARY KEY (household_id, citizen_id),
    FOREIGN KEY (household_id) REFERENCES household(household_id) ON DELETE CASCADE,
    FOREIGN KEY (citizen_id)   REFERENCES citizen(citizen_id)     ON DELETE CASCADE
);

CREATE TABLE living_condition (
    living_condition_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    household_id        INT UNSIGNED,
    condition_type      VARCHAR(100),
    description         TEXT,
    assessment_date     DATE,
    FOREIGN KEY (household_id) REFERENCES household(household_id) ON DELETE CASCADE
);

CREATE TABLE allowance_regime (
    regime_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    regime_name VARCHAR(255) NOT NULL,
    base_amount DECIMAL(15,2),
    description TEXT
);

CREATE TABLE citizen_allowance (
    citizen_id INT UNSIGNED,
    regime_id  INT UNSIGNED,
    start_date DATE,
    end_date   DATE,
    status     ENUM('active','suspended','stopped'),
    PRIMARY KEY (citizen_id, regime_id),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id)         ON DELETE CASCADE,
    FOREIGN KEY (regime_id)  REFERENCES allowance_regime(regime_id) ON DELETE CASCADE
);

CREATE TABLE campaign (
    campaign_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(255),
    year          INT
);

CREATE TABLE gift_category (
    gift_category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name    VARCHAR(100),
    unit             VARCHAR(20)
);

CREATE TABLE agency (
    agency_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agency_name VARCHAR(255),
    agency_type ENUM('state_management','medical_facility','cemetery_management')
                DEFAULT 'state_management',
    level       TINYINT,
    parent_id   INT UNSIGNED,
    FOREIGN KEY (parent_id) REFERENCES agency(agency_id) ON DELETE SET NULL
);

CREATE TABLE official (
    official_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agency_id     INT UNSIGNED,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50),
    FOREIGN KEY (agency_id) REFERENCES agency(agency_id)
);

CREATE TABLE visit_log (
    visit_log_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    campaign_id      INT UNSIGNED,
    citizen_id       INT UNSIGNED,
    gift_category_id INT UNSIGNED,
    value            DECIMAL(15,2),
    status           ENUM('done','pending','missed'),
    visited_at       DATETIME,
    officer_id       INT UNSIGNED,
    INDEX (citizen_id),
    FOREIGN KEY (campaign_id)      REFERENCES campaign(campaign_id),
    FOREIGN KEY (citizen_id)       REFERENCES citizen(citizen_id)            ON DELETE CASCADE,
    FOREIGN KEY (gift_category_id) REFERENCES gift_category(gift_category_id),
    FOREIGN KEY (officer_id)       REFERENCES official(official_id)          ON DELETE SET NULL
);

CREATE TABLE dossier (
    dossier_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id   INT UNSIGNED,
    status       ENUM('draft','submitted','approved','rejected'),
    dossier_type ENUM('new_regime','adjust_regime','stop_regime') DEFAULT 'new_regime',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    reviewed_at  TIMESTAMP NULL,
    reviewed_by  INT UNSIGNED NULL,
    note         TEXT,
    FOREIGN KEY (citizen_id)  REFERENCES citizen(citizen_id)   ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES official(official_id) ON DELETE SET NULL
);

CREATE TABLE attachment (
    attachment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dossier_id    INT UNSIGNED,
    file_name     VARCHAR(255),
    file_url      VARCHAR(500),
    uploaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dossier_id) REFERENCES dossier(dossier_id) ON DELETE CASCADE
);

CREATE TABLE authorization (
    authorization_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    policy_holder_id INT UNSIGNED,
    proxy_id         INT UNSIGNED,
    relation         VARCHAR(50),
    document_url     VARCHAR(500),
    start_date       DATE,
    end_date         DATE,
    status           ENUM('active','expired','revoked') DEFAULT 'active',
    FOREIGN KEY (policy_holder_id) REFERENCES citizen(citizen_id) ON DELETE CASCADE,
    FOREIGN KEY (proxy_id)         REFERENCES citizen(citizen_id) ON DELETE CASCADE
);

CREATE TABLE dossier_transfer (
    dossier_transfer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dossier_id          INT UNSIGNED,
    from_agency         INT UNSIGNED,
    to_agency           INT UNSIGNED,
    transfer_date       DATE,
    FOREIGN KEY (dossier_id)  REFERENCES dossier(dossier_id),
    FOREIGN KEY (from_agency) REFERENCES agency(agency_id),
    FOREIGN KEY (to_agency)   REFERENCES agency(agency_id)
);

CREATE TABLE feedback_ticket (
    feedback_ticket_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id         INT UNSIGNED,
    title              VARCHAR(200),
    content            TEXT,
    reply              TEXT,
    status             ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_by        INT UNSIGNED NULL,
    resolved_at        TIMESTAMP NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES official(official_id) ON DELETE SET NULL
);

CREATE TABLE audit_log (
    audit_log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    official_id  INT UNSIGNED,
    action       VARCHAR(50),
    table_name   VARCHAR(50),
    record_id    BIGINT UNSIGNED,
    old_data     JSON,
    new_data     JSON,
    ip_address   VARCHAR(45),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (official_id) REFERENCES official(official_id)
);

CREATE TABLE payment_history (
    payment_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    citizen_id      INT UNSIGNED NOT NULL,
    regime_id       INT UNSIGNED NOT NULL,
    amount          DECIMAL(15,2) NOT NULL,
    payment_date    DATE NOT NULL,
    account_number  VARCHAR(30) NOT NULL,
    bank_name       VARCHAR(200) NOT NULL,
    status          ENUM('success', 'failed') DEFAULT 'success',
    payment_note    VARCHAR(255),
    FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id)         ON DELETE CASCADE,
    FOREIGN KEY (regime_id)  REFERENCES allowance_regime(regime_id) ON DELETE CASCADE
);

CREATE INDEX idx_dossier_citizen_id ON dossier (citizen_id);
CREATE INDEX idx_citizen_allowance_citizen_id ON citizen_allowance (citizen_id);
CREATE INDEX idx_visit_log_campaign_id ON visit_log (campaign_id);
CREATE INDEX idx_audit_log_table_name_created_at ON audit_log (table_name, created_at);