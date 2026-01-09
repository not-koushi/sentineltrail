export interface AuditLog {
  log_id: number;
  service_id: string;
  event_type: string;
  actor_id: string;
  created_at: string;
}

export interface VerificationStatus {
  status: "verified" | "tampered";
  detected_at_log?: number;
}