const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = __dirname;
const port = 5173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
};

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const target = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative) || relative.split(/[\\/]/).some(part => part.startsWith(".")) || !types[path.extname(target)]) {
    response.writeHead(403).end();
    return;
  }
  fs.readFile(target, (error, content) => {
    if (error) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[path.extname(target)],
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  });
});

server.on("error", error => {
  console.error(error.code === "EADDRINUSE"
    ? "El puerto 5173 ya está ocupado. Si el proyecto ya está abierto, visita http://127.0.0.1:5173; de lo contrario, cierra el proceso que usa ese puerto."
    : error.message);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Para Lizeth: ${url}\nDeja esta ventana abierta mientras escuchas la canción. Ctrl+C para cerrar.`);
  if (process.argv.includes("--open") && process.platform === "win32") {
    const opener = spawn("explorer.exe", [url], { windowsHide: true, stdio: "ignore" });
    opener.on("error", () => console.log(`Abre ${url} en tu navegador.`));
  }
});
