export interface AuditLog {
  id: number;
  timestamp: string;
  service: string;
  action: string;
  payload: string;
  current_hash: string;
  previous_hash: string;
}

export interface VerificationResult {
  log_id: number;
  valid: boolean;
  reason?: string;
}