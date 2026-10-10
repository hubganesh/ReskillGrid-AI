"""
GET /api/roles
Returns the list of available target roles.
Vercel Python serverless function.
"""
from http.server import BaseHTTPRequestHandler
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _lib import JOB_REQUIREMENTS  # noqa: E402


class handler(BaseHTTPRequestHandler):

    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        body = json.dumps({"roles": list(JOB_REQUIREMENTS.keys())}).encode()
        self.send_response(200)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass
