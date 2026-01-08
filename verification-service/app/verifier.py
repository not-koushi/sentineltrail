import hashlib

def compute_hash(payload: str, previous_hash: str) -> str:
    h = hashlib.sha256()
    h.update(payload.encode())
    h.update((previous_hash or "").encode())
    return h.hexdigest()

def verify_chain(rows):
    previous_row_hash = None
    
    for log_id, payload, prev_hash, current_hash in rows:
        # Rule 1: previous_hash must match previosu row's current_hash
        if prev_hash != previous_row_hash:
            return False, log_id

        # Rule 2: current_hash must match computed hash (payload + previous_hash)
        expected = compute_hash(payload, prev_hash)

        if expected != current_hash:
            return False, log_id

        previous_row_hash = current_hash
    return True, None