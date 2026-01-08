import hashlib
import psycopg2
import os
import sys

DATABASE_URL = os.getenv("DATABASE_URL")

def compute_hash(payload: str, previous_hash: str) -> str:
    h = hashlib.sha256()
    h.update(payload.encode())
    h.update((previous_hash or "").encode())
    return h.hexdigest()

def verify_chain():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT log_id, payload::text, previous_hash, current_hash
        FROM audit_logs
        ORDER BY log_id
    """)
    rows = cur.fetchall()

    last_hash = None

    for log_id, payload, previous_hash, stored_hash in rows:
        expected_hash = compute_hash(payload, last_hash)

        if stored_hash != expected_hash:
            print(f"TAMPER DETECTED at log_id = {log_id}")
            sys.exit(1)

        last_hash = stored_hash

    print("VERIFIED: audit log chain is intact")

if __name__ == "__main__":
    verify_chain()