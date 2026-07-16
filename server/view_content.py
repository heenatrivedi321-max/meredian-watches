#!/usr/bin/env python3
"""
Simple content viewer server.
Run: python3 view_content.py
Then open: http://localhost:8080
"""

import json
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

CONTENT_DIR = Path(__file__).parent / "content"
VIEWER_HTML = Path(__file__).parent / "content_viewer.html"


class ContentHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(VIEWER_HTML.read_bytes())
            return

        if self.path == "/api/content":
            posts = []
            for f in sorted(CONTENT_DIR.glob("*.json")):
                with open(f) as fh:
                    posts.append(json.load(fh))
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(posts).encode())
            return

        if self.path.startswith("/api/image/"):
            img_name = self.path.split("/api/image/")[1]
            img_path = CONTENT_DIR / img_name
            if img_path.exists():
                self.send_response(200)
                self.send_header("Content-Type", "image/jpeg")
                self.end_headers()
                self.wfile.write(img_path.read_bytes())
            else:
                self.send_response(404)
                self.end_headers()
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8080), ContentHandler)
    print("Content Viewer: http://localhost:8080")
    server.serve_forever()
