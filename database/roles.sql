-- Dedicated owner role (no login)
CREATE ROLE sentineltrail_owner;

-- Application role
CREATE ROLE sentineltrail_app LOGIN PASSWORD 'changeme';

-- Change ownership of audit table
ALTER TABLE audit_logs OWNER TO sentineltrail_owner;

-- Permissions for application role
GRANT CONNECT ON DATABASE sentineltrail TO sentineltrail_app;
GRANT USAGE ON SCHEMA public TO sentineltrail_app;

REVOKE ALL ON audit_logs FROM sentineltrail_app;
GRANT INSERT, SELECT ON audit_logs TO sentineltrail_app;
