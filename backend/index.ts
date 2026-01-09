import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  res.json({ token: "mock-jwt", user_id: (req.body as any)?.user_id });
});

// Health endpoints (used by local checks + deploy platforms)
app.get("/_health", (_req, res) => {
  res.status(200).json({ ok: true, service: "backend", ts: new Date().toISOString() });
});

app.get("/_readyz", (_req, res) => {
  // If you later add DB/redis, check them here.
  res.status(200).json({ ok: true, ready: true, ts: new Date().toISOString() });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Backend on ${PORT}`);
});
