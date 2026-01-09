from flask import Flask, jsonify
from app.db import get_connection
from app.verifier import verify_chain

app = Flask(__name__)

@app.route("/api/status")
def status():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT log_id, hash_input, previous_hash, current_hash
        FROM audit_logs
        ORDER BY log_id
    """)
    rows = cur.fetchall()

    verified, bad_log = verify_chain(rows)

    if verified:
        return jsonify({ "status": "verified" })
    else:
        return jsonify({
            "status": "tampered",
            "detected_at_log": bad_log
        })