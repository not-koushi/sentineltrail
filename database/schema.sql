-- SentinelTrail Audit Log Schema
-- Purpose: Append-only, tamper-evident audit storage

CREATE TABLE audit_logs (
    -- Monotonic identifier
    log_id BIGSERIAL PRIMARY KEY,

    -- Metadata
    service_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    actor_id  TEXT NOT NULL,

    -- Original event payload (human + machine readable)
    payload JSONB NOT NULL,

    -- EXACT string used for hashing (canonical, immutable)
    -- This prevents JSON reserialization mismatches
    hash_input TEXT NOT NULL,

    -- Hash chain fields
    previous_hash TEXT,
    current_hash  TEXT NOT NULL,

    -- Audit timestamp (timezone-aware)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce append-only semantics at schema level
-- (Permissions will block UPDATE / DELETE at role level)

-- Helpful index for verification & audit queries
CREATE INDEX idx_audit_logs_log_id ON audit_logs (log_id);