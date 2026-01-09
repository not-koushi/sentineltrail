import type { AuditLog, VerificationStatus } from "../types/audit";

const API_BASE = "http://localhost:5001";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/api/logs`);
  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }
  return res.json();
}

export async function fetchVerificationStatus(): Promise<VerificationStatus> {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) {
    throw new Error("Failed to fetch verification status");
  }
  return res.json();
}