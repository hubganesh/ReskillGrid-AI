"""
POST /api/update-task
Acknowledges a task status update (stateless, state lives in the frontend).
"""
from http.server import BaseHTTPRequestHandler
import json


VALID_STATUSES = {"pending", "in-progress", "completed"}


class handler(BaseHTTPRequestHandler):

    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError) as exc:
            self._respond(400, {"error": f"Invalid JSON: {exc}"})
            return

        skill = payload.get("skill", "")
        status = payload.get("status", "")

        if status not in VALID_STATUSES:
            self._respond(400, {"error": f"status must be one of {sorted(VALID_STATUSES)}"})
            return

        self._respond(200, {"skill": skill, "status": status, "acknowledged": True})

    def _respond(self, status: int, body: dict) -> None:
        data = json.dumps(body).encode()
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *_):
        pass
