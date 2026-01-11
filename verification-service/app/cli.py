from app.db import get_connection
from app.verifier import verify_chain
from app.merkle import build_merkle_root

def main():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT log_id, hash_input, previous_hash, current_hash
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
    else:
        print(f"TAMPER DETECTED at log_id = {bad_log}")

if __name__ == "__main__":
    main()