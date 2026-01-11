import { useEffect, useState } from "react";
import {
  fetchAuditLogs,
  fetchVerificationStatus,
  runVerification,
} from "./api/audit";
import type { AuditLog, VerificationStatus } from "./types/audit";
import { Timeline } from "./components/Timeline";
import { StatusBadge } from "./components/StatusBadge";
import { IncidentBanner } from "./components/IncidentBanner";

function App() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [logsData, statusData] = await Promise.all([
        fetchAuditLogs(),
        fetchVerificationStatus(),
      ]);

      setLogs(logsData);
      setStatus(statusData);
    } catch (err) {
      setError("Failed to load audit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRerunVerification = async () => {
    try {
      setLoading(true);
      const result = await runVerification();
      setStatus(result);
    } catch (err) {
      setError("Failed to re-run verification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>SentinelTrail Audit Dashboard</h1>
        <p>Loading audit data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>SentinelTrail Audit Dashboard</h1>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={loadData}
          style={{ marginTop: "10px", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>SentinelTrail Audit Dashboard</h1>

      <p style={{ color: "#666" }}>
        Cryptographic integrity monitoring for audit logs
      </p>

      {/* Manual refresh control */}
      <button
        onClick={loadData}
        style={{ marginRight: "10px", cursor: "pointer" }}
      >
        Refresh
      </button>

      {/* Re-run verification action */}
      <button
        onClick={handleRerunVerification}
        style={{ cursor: "pointer" }}
      >
        Re-run Verification
      </button>

      <div style={{ marginTop: "15px" }}>
        <StatusBadge status={status} />
      </div>

      <IncidentBanner status={status} />

      <Timeline
        logs={logs}
        highlightId={status.detected_at_log}
      />
    </div>
  );
}

export default App;