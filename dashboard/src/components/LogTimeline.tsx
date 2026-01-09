import type { AuditLog, VerificationResult } from "../types/audit";
import IntegrityBadge from "./IntegrityBadge";

interface Props {
  logs: AuditLog[];
  results: VerificationResult[];
}

export default function LogTimeline({ logs, results }: Props) {
  const map = new Map(results.map(r => [r.log_id, r.valid]));

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Service</th>
          <th>Action</th>
          <th>Integrity</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.service}</td>
            <td>{log.action}</td>
            <td>
              <IntegrityBadge valid={map.get(log.id) ?? false} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}