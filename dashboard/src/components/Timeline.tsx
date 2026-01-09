import type { AuditLog } from "../types/audit";

interface Props {
  logs: AuditLog[];
  highlightId?: number;
}

export function Timeline({ logs, highlightId }: Props) {
  return (
    <ul>
      {logs.map((log) => (
        <li
          key={log.log_id}
          style={{
            padding: "8px",
            background:
              log.log_id === highlightId ? "#ffe6e6" : "transparent",
          }}
        >
          [{new Date(log.created_at).toLocaleTimeString()}]{" "}
          {log.service_id} {log.event_type} ({log.actor_id})
        </li>
      ))}
    </ul>
  );
}