# 🛡️ Integrity Design — SentinelTrail

---

## Purpose

This document explains how SentinelTrail guarantees tamper-evident audit logs, the cryptographic primitives used, and the security properties they provide.

SentinelTrail is not a blockchain.
It is a cryptographically verifiable audit ledger designed for clarity, correctness, and demonstrability.

---

## 1. Threat Model

SentinelTrail assumes the following threats:
- An attacker may gain write access to the database
- An insider may attempt to alter historical audit logs
- Logs must remain tamper-evident, even if storage is compromised

Out of scope (by design):
- Confidentiality of payload contents
- Availability guarantees
- Prevention of deletion by a privileged DB superuser

The goal is **detection**, not prevention.

---

## 2. Hash Chain (Primary Integrity Mechanism)

Each audit log entry contains:
- `hash_input` - canonical representation of the log event
- `previous_hash` - hash of the previous log
- `current_hash` - SHA-256 hash of `(hash_input + previous_hash)`

#### Chain Property

```bash
Log 1 → Log 2 → Log 3 → ... → Log N
```

#### Where:

```bash
log[i].previous_hash == log[i-1].current_hash
```

This creates a **single chain of trust**.

---

## Why Tampering invalidates the entire chain

If any log is modified:
- Its `current_hash` becomes invalid
- All subsequent `previous_hash` references break
- The chain no longer forms a valid sequence

As a result:
> SentinelTrail reports tampering at log_id = 1, the root of trust.

This does not mean log 1 was edited — it means:
> “The history anchored at log 1 is no longer trustworthy.”

This behavior is **intentional** and **correct**.

---

## Verification Logic

Verification performs two checks for every log:

#### a. Integrity Check

```bash
SHA256(hash_input + previous_hash) == current_hash
```

#### b. Link check

```bash
previous_hash matches prior log’s current_hash
```

Failure of either condition invalidates the chain.Verification is:
- Deterministic
- Stateless
- Recomputable from raw data

---

## 5. Markle Tree 

After successful chain verification, SentinelTrail builds a Merkle tree over all `current_hash` values.

Purpose:
- Produce a compact cryptographic summary
- Enable future inclusion proofs
- Support efficient comparison of large log sets

Current usage:
- Merkle root is reported as a verification artifact

Future extensions may include:
- Per-log inclusion proofs
- Partial verification
- Cross-system reconciliation

---

## 6. Separation of concerns

SentinelTrail enforces strict separation:

| Component            | Responsibility                     |
| -------------------- | ---------------------------------- |
| Ingestion Service    | Accept events and build hash chain |
| Database             | Append-only storage                |
| Verification Service | Decide integrity truth             |
| Dashboard            | Visualize verification results     |

The dashboard never computes integrity. It only displays **authoritative verification results**.

---

## 7. Design Rationale

Key design decisions:
- Hash chains instead of blockchain → clarity and simplicity
- Read-only verification APIs → audit safety
- No mutation endpoints → integrity preservation
- Explicit failure states → forensic usability

> SentinelTrail favors **explainability over novelty**.

---

## 8. Summary

SentinelTrail guarantees:
- Tamper-evident audit history
- Cryptographic verification of integrity
- Clear failure signaling
- Human-readable and machine-verifiable outputs

This design mirrors real-world audit and ledger systems while remaining intentionally minimal.

---