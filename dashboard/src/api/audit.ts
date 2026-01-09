import type { AuditLog, VerificationStatus } from "../types/audit";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  return [
    {
      log_id: 1,
      service_id: "auth",
      event_type: "LOGIN",
      actor_id: "user1",
      created_at: "2026-01-09T10:01:00Z",
    },
    {
      log_id: 2,
      service_id: "auth",
      event_type: "LOGOUT",
      actor_id: "user1",
      created_at: "2026-01-09T10:05:00Z",
    },
  ];
}

export async function fetchVerificationStatus(): Promise<VerificationStatus> {
  return {
    status: "tampered",
    detected_at_log: 1,
  };
}
