-- Dedicated owner role (no login)
CREATE ROLE sentineltrail_owner;

-- Application role
CREATE ROLE sentineltrail_app LOGIN PASSWORD 'changeme';

-- Assign ownership
ALTER TABLE audit_logs OWNER TO sentineltrail_owner;
ALTER SEQUENCE audit_logs_log_id_seq OWNER TO sentineltrail_owner;

-- Database access
GRANT CONNECT ON DATABASE sentineltrail TO sentineltrail_app;
GRANT USAGE ON SCHEMA public TO sentineltrail_app;

-- Table permissions
REVOKE ALL ON audit_logs FROM sentineltrail_app;
GRANT INSERT, SELECT ON audit_logs TO sentineltrail_app;

-- Sequence permissions
GRANT USAGE, SELECT ON SEQUENCE audit_logs_log_id_seq TO sentineltrail_app;