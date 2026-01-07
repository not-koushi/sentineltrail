CREATE ROLE sentineltrail_app LOGIN PASSWORD 'changeme';

GRANT CONNECT ON DATABASE sentineltrail TO sentineltrail_app;
GRANT USAGE ON SCHEMA public TO sentineltrail_app;

GRANT INSERT, SELECT ON audit_logs TO sentineltrail_app;
REVOKE UPDATE, DELETE ON audit_logs FROM sentineltrail_app;