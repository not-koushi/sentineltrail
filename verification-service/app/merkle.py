import hashlib

def hash_pair(left: str, right: str) -> str:
    h = hashlib.sha256()
    h.update(left.encode())
    h.update(right.encode())
    return h.hexdigest()

def build_merkle_root(hashes):
    if not hashes:
        return None

    level = hashes[:]

    while len(level) > 1:
        next_level = []

        for i in range(0, len(level), 2):
            left = level[i]
            right = level[i + 1] if i + 1 < len(level) else left
            next_level.append(hash_pair(left, right))

        level = next_level

    return level[0]