import hashlib

def compute_hash(hash_input: str) -> str:
    return hashlib.sha256(hash_input.encode()).hexdigest()

def verify_chain(rows):
    previous_row_hash = None

    for log_id, hash_input, prev_hash, current_hash in rows:
        # 1. Chain linkage
        if prev_hash != previous_row_hash:
            return False, log_id

        # 2. Hash integrity
        expected = compute_hash(hash_input)
        if expected != current_hash:
            return False, log_id

        previous_row_hash = current_hash

    return True, None