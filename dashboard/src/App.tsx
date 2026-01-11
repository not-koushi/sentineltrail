import { useEffect, useState } from "react";
import { fetchAuditLogs, fetchVerificationStatus } from "./api/audit";
import type { AuditLog, VerificationStatus } from "./types/audit";
import { Timeline } from "./components/Timeline";
import { StatusBadge } from "./components/StatusBadge";
import { IncidentBanner } from "./components/IncidentBanner";

function App() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [status, setStatus] = useState<VerificationStatus | null>(null);

  const loadData = async () => {
    const [logsData, statusData] = await Promise.all([
      fetchAuditLogs(),
      fetchVerificationStatus(),
    ]);
    setLogs(logsData);
    setStatus(statusData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!status) return null;

  return (
    <div style={{padding: "20px", fontFamily: "monospace"}}>
      <h1>SentinelTrail Audit Dashboard</h1>

      <p style={{color: "#666"}}>
        Cryptographic integrity monitoring for audit logs
      </p>

      {/*Manual refresh control*/}
      <button
        onClick={loadData}
        style={{ marginBottom: "10px", cursor: "pointer" }}
      >
        Refresh
      </button>


      <StatusBadge status={status} />
      <IncidentBanner status={status} />
      <Timeline
        logs={logs}
        highlightId={status.detected_at_log}
      />
    </div>
  );
}

export default App;