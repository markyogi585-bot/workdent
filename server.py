#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
import urllib.parse
import re

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/webm", ".webm")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

class WorkDentHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Clean path
        parsed_url = urllib.parse.urlparse(self.path)
        clean_path = parsed_url.path.strip("/")

        # Root
        if clean_path == "":
            self.path = "/index.html"
            return super().do_GET()

        target_file = os.path.join(DIRECTORY, clean_path)

        # 1. Exact file match
        if os.path.isfile(target_file):
            return super().do_GET()

        # 2. Append .html
        if os.path.isfile(target_file + ".html"):
            self.path = "/" + clean_path + ".html"
            if parsed_url.query:
                self.path += "?" + parsed_url.query
            return super().do_GET()

        # 3. Directory index.html
        if os.path.isdir(target_file) and os.path.isfile(os.path.join(target_file, "index.html")):
            self.path = "/" + clean_path + "/index.html"
            if parsed_url.query:
                self.path += "?" + parsed_url.query
            return super().do_GET()

        # Fallback to super
        return super().do_GET()

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), WorkDentHandler) as httpd:
        print(f"✨ WorkDent Production Server running at http://0.0.0.0:{PORT} (Localhost: {PORT})")
        print(f"📁 Serving: {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
