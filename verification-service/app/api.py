from flask import Flask, jsonify
from flask_cors import CORS

from app.db import get_connection
from app.verifier import verify_chain

app = Flask(__name__)
CORS(app)


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
        return jsonify({"status": "verified"})
    else:
        return jsonify({
            "status": "tampered",
            "detected_at_log": bad_log
        })


@app.route("/api/logs")
def logs():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT log_id, service_id, event_type, actor_id, created_at
        FROM audit_logs
        ORDER BY log_id
    """)

    rows = cur.fetchall()

    logs = [
        {
            "log_id": r[0],
            "service_id": r[1],
            "event_type": r[2],
            "actor_id": r[3],
            "created_at": r[4].isoformat(),
        }
        for r in rows
    ]

    return jsonify(logs)


if __name__ == "__main__":
    # Bind to 0.0.0.0 for Docker
    app.run(host="0.0.0.0", port=5000)