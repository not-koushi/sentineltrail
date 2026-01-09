import type { AuditLog, VerificationStatus } from "../types/audit";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch("httpL//localhost:5001/api/logs");
  return res.json();
}

export async function fetchVerificationStatus(): Promise<VerificationStatus> {
  const res = await fetch ("http://localhost:5001/api/status");
  return res.json();
}
