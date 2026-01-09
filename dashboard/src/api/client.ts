import type { AuditLog, VerificationResult } from "../types/audit";

const BASE_URL = "http://localhost:8000";

export async function fetchLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${BASE_URL}/logs`);
  return res.json();
}

export async function fetchVerification(): Promise<VerificationResult[]> {
  const res = await fetch(`${BASE_URL}/verify`);
  return res.json();
}