// scripts/run-ci-ai.ts
// Wave18: Lightweight AI CI runner for CFH frontend
// - Runs Jest focused on AI/critical tests
// - Writes full output to reports/test-logs/ci-ai_<timestamp>.log
// - Uses process.cwd() (no __dirname / ESM headaches)

import { spawn } from "child_process";
import fs from "fs";
import path from "path";

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "_" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

async function main() {
  // We expect npm to run this from C:\CFH\frontend
  const projectRoot = process.cwd();

  const logsDir = path.join(projectRoot, "reports", "test-logs");
  fs.mkdirSync(logsDir, { recursive: true });

  const stamp = getTimestamp();
  const logPath = path.join(logsDir, `ci-ai_${stamp}.log`);

  const logStream = fs.createWriteStream(logPath, {
    encoding: "utf8",
    flags: "a",
  });

  const isWindows = process.platform === "win32";
  const jestBin = path.join(
    projectRoot,
    "node_modules",
    ".bin",
    isWindows ? "jest.cmd" : "jest"
  );

  // 🎯 SCOPED AI / critical tests only
  // You can tweak this later (e.g. specific testPathPattern or projects)
  const jestArgs = [
    "--runInBand",
    "--config",
    path.join(projectRoot, "jest.config.cjs"),
    "--passWithNoTests",
    // Keep this narrow at first; we can expand once it's clean
    "--testPathPattern=src/tests/ai/",
  ];

  const headerLines = [
    "[ci-ai] CFH AI CI runner",
    `[ci-ai] Project root : ${projectRoot}`,
    `[ci-ai] Logs dir     : ${logsDir}`,
    `[ci-ai] Log file     : ${logPath}`,
    `[ci-ai] Jest command : ${jestBin} ${jestArgs.join(" ")}`,
    "",
  ];

  const header = headerLines.join("\n");
  process.stdout.write(header + "\n");
  logStream.write(header + "\n");

  const child = spawn(jestBin, jestArgs, {
    cwd: projectRoot,
    env: {
      ...process.env,
      CI: "true",
    },
    shell: false,
  });

  child.stdout.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    process.stdout.write(text);
    logStream.write(text);
  });

  child.stderr.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    process.stderr.write(text);
    logStream.write(text);
  });

  child.on("close", (code: number | null) => {
    const finalCode = code ?? 1;

    const footer =
      `\n[ci-ai] Jest finished with exit code ${finalCode}\n` +
      `[ci-ai] Full log: ${logPath}\n`;
    process.stdout.write(footer);
    logStream.write(footer);
    logStream.end();

    // Let CI fail if tests fail, but keep logs always
    process.exit(finalCode);
  });

  child.on("error", (err) => {
    const msg = `[ci-ai] Failed to start Jest: ${err.message}\n`;
    process.stderr.write(msg);
    logStream.write(msg);
    logStream.end();
    process.exit(1);
  });
}

main().catch((err) => {
  const msg = `[ci-ai] Fatal error before spawn: ${err?.message || err}\n`;
  process.stderr.write(msg);
  process.exit(1);
});
