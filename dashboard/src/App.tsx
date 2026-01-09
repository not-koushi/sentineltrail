import { useEffect, useState } from "react";
import { fetchLogs, fetchVerification } from "./api/client";
import type { AuditLog, VerificationResult } from "./types/audit";
import LogTimeline from "./components/LogTimeline";
import TamperAlert from "./components/TamperAlert";
import "./styles/app.css";

export default function App() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [results, setResults] = useState<VerificationResult[]>([]);

  useEffect(() => {
    fetchLogs().then(setLogs);
    fetchVerification().then(setResults);
  }, []);

  const hasTamper = results.some(r => !r.valid);

  return (
    <div>
      <h1>SentinelTrail Audit Dashboard</h1>
      {hasTamper && <TamperAlert />}
      <LogTimeline logs={logs} results={results} />
    </div>
  );
}