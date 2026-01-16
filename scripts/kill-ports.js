/**
 * Dev helper: kill stale processes holding the dev ports.
 * This avoids Vite auto-switching to 5174 and colliding with the backend.
 *
 * Ports:
 * - 5173: frontend (Vite)
 * - 5174: backend (Express)
 *
 * TODO: Make ports configurable via env if needed.
 */

const { execFileSync, execSync } = require("node:child_process");

const PORTS = [5173, 5174];

function isWindows() {
  return process.platform === "win32";
}

function killWindowsPort(port) {
  let out = "";
  try {
    // Keep output small by filtering in cmd.
    out = execFileSync("cmd.exe", ["/c", `netstat -ano | findstr :${port} | findstr LISTENING`], {
      stdio: ["ignore", "pipe", "ignore"]
    }).toString();
  } catch {
    out = "";
  }

  const lines = out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pids = [...new Set(lines.map((l) => l.split(/\s+/).pop()))].filter(Boolean);

  if (pids.length === 0) return;

  for (const pid of pids) {
    try {
      // /T kills child processes too; /F forces.
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
      console.log(`[kill-ports] Killed PID ${pid} (port ${port})`);
    } catch {
      console.log(`[kill-ports] Could not kill PID ${pid} (port ${port})`);
    }
  }
}

function main() {
  if (!isWindows()) {
    console.log("[kill-ports] Non-Windows OS detected; skipping auto-kill.");
    return;
  }

  for (const port of PORTS) {
    killWindowsPort(port);
  }
}

main();

