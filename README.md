# 🛡️ SentinelTrail

**SentinelTrail** is a tamper-evident audit logging system that guarantees the integrity of audit records using cryptographic hash chaining and Merkle tree verification.

It is designed to demonstrate how real-world systems can detect unauthorized modification of historical logs — without relying on a full blockchain.

---

## ✨ Key Features

- 🔗 **Hash-chained audit logs** (append-only integrity)
- 🌳 **Merkle tree verification** for cryptographic summaries
- 🚨 **Deterministic tamper detection**
- 🧾 **Forensic reports** (human + machine readable)
- 🐳 **Fully containerized** with Docker Compose
- 🔐 **Audit-grade data modeling**

---

## 🧠 How SentinelTrail Works

SentinelTrail is built around **three stages**:

### 1️⃣ Ingestion (Go)
- Receives audit events over HTTP
- Builds a cryptographic hash chain
- Stores logs in PostgreSQL
- Persists the *exact canonical hash input* used for verification

### 2️⃣ Storage (PostgreSQL)
- Append-only audit table
- Each log links to the previous via `previous_hash`
- Tampering anywhere breaks the chain

### 3️⃣ Verification (Python)
- Recomputes and verifies the hash chain
- Builds a Merkle tree over all committed hashes
- Emits verification reports:
  - `latest.txt` for clean state
  - `tamper_report.json` for compromised state

---

## 🚀 Getting Started

### Prerequisites
- Docker
- Docker Compose

---

### Start the system

```bash
docker compose down -v
docker compose up -d --build
```

### Health Check

```bash
Invoke-WebRequest http://localhost:8080/health
```

### Ingest audit logs

```powershell
Invoke-WebRequest `
  -Method POST `
  -Uri http://localhost:8080/ingest `
  -ContentType "application/json" `
  -Body '{"service_id":"auth","event_type":"LOGIN","actor_id":"user1","payload":{"ip":"127.0.0.1"}}'
```

### Run verification

```bash
docker compose run --rm verifier
```

### Clean state

```bash
VERIFIED
Markle root: <hash>
```

### After Tampering

```bash
TAMPER DETECTED at log_id = 1
```

---

## 🧪 Tamper Demonstration

Simulate an attack:

```sql
UPDATE audit_logs
SET current_hash = 'evil'
WHERE log_id = 1;
```

Re-run verification:

```bash
docker compose run --rm verififer
```

A forensic report will be written to:

```bash
verification-service/reports/tamper_report.json
```

---

## 🔐 Security Model

- SentinelTrail cryptographically protects **hash commitments**, not raw payloads.
- Any modification to protected fields invalidates the entire chain.
- Hash chains provide **global integrity guarantees**.
- Merkle trees enable **efficient cryptographic summaries** and future localization.

This design mirrors real audit and ledger systems.

---

## 🧾 Reports

| File                 | Purpose                            |
| -------------------- | ---------------------------------- |
| `latest.txt`         | Verification proof for clean state |
| `tamper_report.json` | Machine-readable forensic alert    |

Reports are generated at runtime and intentionally excluded from Git.

---

## 🏷️ Versioning

Current release:
- v1.0.0 - Stable, demo-ready, audit-grade

---

## 🎯 Why this project exists

SentinelTrail was built to explore:
- Cryptographic integrity guarantees
- Audit-grade verification logic
- Real-world pitfalls in log verification
- Clean, production-style architecture

It intentionally avoids "toy blockchain" implementations in favor of clairty and correctness.

---

## 🧑‍💻 Author

Buily by **Koushik Panchadarla**.
Feel free to explore, fork or extend

---
