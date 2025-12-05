// scripts/run-ci-ai.ts
// Wave18: Lightweight AI CI runner for CFH frontend
// - Runs Jest focused on AI / critical tests only
// - Writes full output to reports/test-logs/ci-ai_<timestamp>.log
// - Uses child_process.exec to avoid Windows spawn/EINVAL headaches
// - TypeScript only; no .js files generated.

import { exec } from "child_process";
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

function main() {
  // npm runs this from C:\CFH\frontend
  const projectRoot = process.cwd();

  // Ensure logs directory exists
  const logsDir = path.join(projectRoot, "reports", "test-logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const stamp = getTimestamp();
  const logPath = path.join(logsDir, `ci-ai_${stamp}.log`);

  // Create log stream (log file path is guaranteed to be valid under logsDir)
  const logStream = fs.createWriteStream(logPath, {
    encoding: "utf8",
    flags: "a",
  });

  // AI tests live in C:\CFH\frontend\src\tests\ai
  const aiTestsDir = path.join(projectRoot, "src", "tests", "ai");
  const aiTestsDirExists = fs.existsSync(aiTestsDir);

  // Pattern is relative to Jest root; with cwd=C:\CFH\frontend,
  // the relative path for the smoke test is "src/tests/ai/...".
  const aiTestsRelativePattern = "src/tests/ai/";

  // We intentionally do NOT pass --config to avoid cross-root config issues.
  // Jest version here expects the plural CLI flag: --testPathPatterns
  const jestCmd =
    `npx jest ` +
    `--runInBand ` +
    `--passWithNoTests ` +
    `--testPathPatterns "${aiTestsRelativePattern}"`;

  const headerLines = [
    "[ci-ai] CFH AI CI runner",
    `[ci-ai] Project root          : ${projectRoot}`,
    `[ci-ai] Logs dir              : ${logsDir}`,
    `[ci-ai] Log file              : ${logPath}`,
    `[ci-ai] AI tests dir          : ${aiTestsDir}`,
    `[ci-ai] AI tests dir exists   : ${aiTestsDirExists}`,
    `[ci-ai] Jest command          : ${jestCmd}`,
    "",
  ];
  const header = headerLines.join("\n");

  process.stdout.write(header + "\n");
  logStream.write(header + "\n");

  const child = exec(jestCmd, {
    cwd: projectRoot,
    env: {
      ...process.env,
      CI: "true",
    },
    maxBuffer: 1024 * 1024 * 10, // 10MB buffer
  });

  child.stdout?.on("data", (chunk: Buffer | string) => {
    const text = chunk.toString();
    process.stdout.write(text);
    logStream.write(text);
  });

  child.stderr?.on("data", (chunk: Buffer | string) => {
    const text = chunk.toString();
    process.stderr.write(text);
    logStream.write(text);
  });

  child.on("close", (code) => {
    const finalCode = code ?? 1;
    const footer =
      `\n[ci-ai] Jest finished with exit code ${finalCode}\n` +
      `[ci-ai] Full log: ${logPath}\n`;
    process.stdout.write(footer);
    logStream.write(footer);
    logStream.end();
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

main();
