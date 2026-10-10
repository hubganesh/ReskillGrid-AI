"""
POST /api/analyze
Runs all 6 ReskillGrid AI agents and returns the full skill-gap analysis.
Vercel Python serverless function — handler(request, response).
"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Ensure _lib is importable regardless of Vercel's working directory
sys.path.insert(0, os.path.dirname(__file__))
from _lib import run_analysis  # noqa: E402


class handler(BaseHTTPRequestHandler):

    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:          # preflight
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

        try:
            result = run_analysis(payload)
            self._respond(200, result)
        except Exception as exc:           # pragma: no cover
            self._respond(500, {"error": str(exc)})

    def _respond(self, status: int, body: dict) -> None:
        data = json.dumps(body).encode()
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *_):             # silence default access log
        pass
