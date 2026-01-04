import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/api/auth/login", (req: Request, res: Response) => {
  res.json({ token: "mock-jwt", user_id: (req.body as any)?.user_id });
});

app.listen(3000, () => console.log("Backend on 3000"));
