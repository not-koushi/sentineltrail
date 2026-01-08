from app.db import get_connection
from app.verifier import verify_chain
from app.merkle import build_merkle_root
import json
from datetime import datetime

def main():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT log_id, payload::text, previous_hash, current_hash
        FROM audit_logs
        ORDER BY log_id
    """)
    rows = cur.fetchall()

    verified, bad_log = verify_chain(rows)

    hashes = [row[3] for row in rows]
    merkle_root = build_merkle_root(hashes)

    if verified:
        print("VERIFIED")
        print(f"Merkle root: {merkle_root}")

        with open("reports/latest.txt", "w") as f:
            f.write(f"VERIFIED at {datetime.utcnow()}\n")
            f.write(f"Merkle root: {merkle_root}\n")

    else:
        print(f"TAMPER DETECTED at log_id = {bad_log}")

        with open("reports/tamper_report.json", "w") as f:
            json.dump({
                "status": "tampered",
                "log_id": bad_log,
                "timestamp": datetime.utcnow().isoformat()
            }, f, indent=2)

if __name__ == "__main__":
    main()