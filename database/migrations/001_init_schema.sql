-- 001_init_schema.sql

-- Kích hoạt extension pgcrypto để mã hóa và tạo UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Định nghĩa các ENUM theo yêu cầu
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'AUDITOR', 'AUDIT_TARGET', 'SYSTEM_ADMIN');
CREATE TYPE resolution_issuer_level AS ENUM ('DHDCD', 'HDQT', 'TONG_GIAM_DOC');
CREATE TYPE compliance_status_enum AS ENUM ('DUNG_THAM_QUYEN', 'VUOT_THAM_QUYEN');
CREATE TYPE audit_opinion_enum AS ENUM ('CHAP_NHAN_TOAN_PHAN', 'NHAN_MANH', 'NGOAI_TRU', 'TU_CHOI');
CREATE TYPE approval_authority_enum AS ENUM ('DHDCD', 'HDQT', 'TONG_GIAM_DOC');
CREATE TYPE risk_level_enum AS ENUM ('THAP', 'TRUNG_BINH', 'CAO', 'NGHIEM_TRONG');
CREATE TYPE action_plan_status_enum AS ENUM ('CHUA_XU_LY', 'DANG_XU_LY', 'DA_KHAC_PHUC', 'QUA_HAN');
CREATE TYPE timeliness_status_enum AS ENUM ('DUNG_HAN', 'CHAM_HAN', 'CHUA_CONG_BO');
CREATE TYPE submission_target_enum AS ENUM ('DHDCD', 'HDQT', 'TONG_GIAM_DOC', 'NOI_BO_BKS');

-- 1. Bảng Users (Xác thực & RBAC)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Audit Logs (Kiểm toán bất biến WORM)
CREATE TABLE bks_system_audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    before_state JSONB,
    after_state JSONB,
    tamper_hash TEXT NOT NULL -- Mã HMAC sha256 chống sửa
);

-- Trigger WORM: Chống UPDATE/DELETE trên bks_system_audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CRITICAL: Thao tác UPDATE/DELETE trên audit logs bị nghiêm cấm (WORM).';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_log_tampering
BEFORE UPDATE OR DELETE ON bks_system_audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_tampering();


-- 3. MOD_01: Kế hoạch & Nghị quyết (bks_governance_resolutions)
CREATE TABLE bks_governance_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolution_code VARCHAR(100) UNIQUE NOT NULL,
    issuer_level resolution_issuer_level NOT NULL,
    issue_date DATE NOT NULL,
    compliance_status compliance_status_enum NOT NULL DEFAULT 'DUNG_THAM_QUYEN',
    -- Nội dung nhạy cảm được mã hóa mức cột bằng AES
    bks_audit_notes_encrypted BYTEA, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MOD_02: Giám sát Tài chính (bks_financial_audits)
CREATE TABLE bks_financial_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_code VARCHAR(20) NOT NULL,
    -- CFO mã hóa mức cột để tránh lộ lọt khi chưa được phép
    cfo_cash_flow_encrypted BYTEA, 
    audit_opinion audit_opinion_enum NOT NULL,
    receivable_ratio DECIMAL(5,4) NOT NULL CHECK (receivable_ratio >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MOD_03: Giao dịch Bên liên quan (bks_related_party_txs)
CREATE TABLE bks_related_party_txs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    party_name VARCHAR(255) NOT NULL,
    -- Giá trị giao dịch lớn nhạy cảm cần mã hóa
    tx_value_encrypted BYTEA NOT NULL, 
    approval_authority approval_authority_enum NOT NULL,
    voting_abstention_ok BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MOD_04: Quản lý Phát hiện & Rủi ro (bks_audit_findings)
CREATE TABLE bks_audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    -- Chi tiết lỗi mã hóa
    description_encrypted BYTEA, 
    risk_level risk_level_enum NOT NULL,
    action_plan_status action_plan_status_enum NOT NULL DEFAULT 'CHUA_XU_LY',
    target_deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MOD_05: Công bố thông tin (bks_information_disclosure)
CREATE TABLE bks_information_disclosure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    legal_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_disclosed_at TIMESTAMP WITH TIME ZONE,
    timeliness_status timeliness_status_enum NOT NULL DEFAULT 'DUNG_HAN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MOD_06: Báo cáo & Kế hoạch (bks_reports_and_plans)
CREATE TABLE bks_reports_and_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_code VARCHAR(100) UNIQUE NOT NULL,
    submission_target submission_target_enum NOT NULL,
    -- Báo cáo nhạy cảm mã hóa
    content_encrypted BYTEA, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Module Thu thập Hồ sơ (bks_audit_evidences)
CREATE TABLE bks_audit_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_title TEXT NOT NULL,
    audit_target_user_id UUID REFERENCES users(id),
    assigned_auditor_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING_DOCUMENT',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    -- URL tải xuống file (đã lưu trên S3/MinIO) sẽ mã hóa
    file_url_encrypted BYTEA, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
