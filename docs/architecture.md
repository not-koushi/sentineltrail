## Problem Statement (Template)
#### temp
- Modern logging systems store logs but do not guarantee their integrity.
- Logs can be modified, deleted, or rewritten by administrators or attackers, making them unreliable as forensic evidence.
- SentinelTrail addresses this by enforcing append-only audit logs with cryptographic verification to detect tampering and provide non-repudiation.


## Audit Log Schema

| Field           | Purpose                          |
| --------------- | -------------------------------- |
| `log_id`        | Sequential, immutable identifier |
| `timestamp`     | UTC time of event                |
| `service_id`    | Originating service              |
| `event_type`    | Action performed                 |
| `actor_id`      | Who performed the action         |
| `payload`       | Structured event data            |
| `previous_hash` | Hash of previous log             |
| `current_hash`  | Hash of this log                 |


## Design Rules
- No nullable fields except `previous_hash` (first log).
- `payload` is JSON.
- Hashes are hex encoded SHA-256.