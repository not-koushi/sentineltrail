from app.db import get_connection
from app.verifier import verify_chain
from app.merkle import build_merkle_root
import json
from datetime import datetime, timezone
import os

def main():
    # Ensure reports directory exists (important for Docker volume)
    os.makedirs("reports", exist_ok=True)

    conn = get_connection()
    cur = conn.cursor()

    # Debug: prove verifier is reading the correct DB
    cur.execute("SELECT COUNT(*) FROM audit_logs;")
    count = cur.fetchone()[0]
    print(f"[DEBUG] verifier sees {count} audit logs")

    # Fetch canonical verification data
    cur.execute("""
        SELECT log_id, hash_input, previous_hash, current_hash
        FROM audit_logs
        ORDER BY log_id
    """)
    rows = cur.fetchall()

    verified, bad_log = verify_chain(rows)

    # Build Merkle tree from committed hashes
    hashes = [row[3] for row in rows]
    merkle_root = build_merkle_root(hashes)

    timestamp = datetime.now(timezone.utc).isoformat()

    if verified:
        print("VERIFIED")
        print(f"Merkle root: {merkle_root}")

        with open("reports/latest.txt", "w") as f:
            f.write(f"VERIFIED at {timestamp}\n")
            f.write(f"Merkle root: {merkle_root}\n")
            f.write(f"Logs verified: {len(rows)}\n")

    else:
        print(f"TAMPER DETECTED at log_id = {bad_log}")

        with open("reports/tamper_report.json", "w") as f:
            json.dump(
                {
                    "status": "tampered",
                    "detected_at_log": bad_log,
                    "timestamp": timestamp,
                    "note": "Hash chain integrity violated; entire chain untrusted"
                },
                f,
                indent=2,
            )

if __name__ == "__main__":
    main()