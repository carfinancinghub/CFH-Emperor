import { exec } from "child_process";
import fs from "fs";
import path from "path";

function timestamp(): string {
  const now = new Date();
  // e.g. 20251205_033619
  return now.toISOString().replace(/[-:T]/g, "").split(".")[0];
}

const ts = timestamp();
const reportsDir = path.join(__dirname, "..", "reports", "jest");
const logPath = path.join(reportsDir, `ci-ai_${ts}.log`);

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

console.log(`\n[CI-AI] Writing Jest output to: ${logPath}\n`);

// AI-only lane: only tests under src/tests/ai
const jestCmd = `jest --runInBand src/tests/ai`;

const subprocess = exec(jestCmd, { maxBuffer: 1024 * 1024 * 10 });
const logStream = fs.createWriteStream(logPath);

subprocess.stdout?.on("data", (chunk: Buffer | string) => {
  process.stdout.write(chunk);
  logStream.write(chunk);
});

subprocess.stderr?.on("data", (chunk: Buffer | string) => {
  process.stderr.write(chunk);
  logStream.write(chunk);
});

subprocess.on("close", (code) => {
  logStream.end();
  console.log(`\n[CI-AI] Jest finished with exit code ${code}`);
  console.log(`[CI-AI] Full log saved to: ${logPath}\n`);
  process.exit(code ?? 0);
});
