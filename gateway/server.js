import http from "http";
import fs from "fs";
import path from "path";

const logFile = process.env.LOG_FILE || path.join(process.cwd(), "logs", "access.jsonl");
fs.mkdirSync(path.dirname(logFile), { recursive: true });

const server = http.createServer(async (req, res) => {
  const caller = req.headers["x-caller-service"] || "unknown";
  const start = Date.now();

  const logEntry = {
    timestamp: new Date().toISOString(),
    caller,
    method: req.method,
    path: req.url,
    status: 200,
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", caller, url: req.url }));
});

const PORT = process.env.PORT || 8088;
server.listen(PORT, () => {
  console.log(`Lab Gateway running on port ${PORT}`);
});
