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

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Backend on ${PORT}`);
});
