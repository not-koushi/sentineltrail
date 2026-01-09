import type { VerificationStatus } from "../types/audit";

export function IncidentBanner({
  status,
}: {
  status: VerificationStatus;
}) {
  if (status.status !== "tampered") return null;

  return (
    <div style={{ color: "red", marginBottom: "12px" }}>
      ⚠️ Integrity violation detected at log ID{" "}
      {status.detected_at_log}
    </div>
  );
}
