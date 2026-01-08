import hashlib

def compute_hash(payload: str, previous_hash: str) -> str:
    h = hashlib.sha256()
    h.update(payload.encode())
    h.update((previous_hash or "").encode())
    return h.hexdigest()

def verify_chain(rows):
    last_hash = None

    for log_id, payload, prev_hash, stored_hash in rows:
        expected = compute_hash(payload, last_hash)

        if expected != stored_hash:
            return False, log_id

        last_hash = stored_hash

    return True, None