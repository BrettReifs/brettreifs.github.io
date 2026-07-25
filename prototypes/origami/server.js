const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split("?")[0]);
  const normalizedPath = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
  const relativePath = normalizedPath === "/index.html"
    ? "prototypes/origami/index.html"
    : normalizedPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end(error.code || "Error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Origami prototype: http://127.0.0.1:${port}/prototypes/origami/?variant=1`);
});
