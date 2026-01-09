import { useEffect, useState } from "react";
import { fetchAuditLogs, fetchVerificationStatus } from "./api/audit";
import type { AuditLog, VerificationStatus } from "./types/audit";
import { Timeline } from "./components/Timeline";
import { StatusBadge } from "./components/StatusBadge";
import { IncidentBanner } from "./components/IncidentBanner";

function App() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [status, setStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    fetchAuditLogs().then(setLogs);
    fetchVerificationStatus().then(setStatus);
  }, []);

  if (!status) return null;

  return (
    <>
      <StatusBadge status={status} />
      <IncidentBanner status={status} />
      <Timeline
        logs={logs}
        highlightId={status.detected_at_log}
      />
    </>
  );
}

export default App;