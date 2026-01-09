import type { VerificationStatus } from "../types/audit";

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const color = status.status === "verified" ? "green" : "red";

  return (
    <div style={{ color, fontWeight: "bold" }}>
      Integrity Status: {status.status.toUpperCase()}
    </div>
  );
}
