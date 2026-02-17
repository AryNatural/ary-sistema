import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


const app = express();


app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));


const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true
  })
);


app.get("/health", (req, res) => {
  res.json({ ok: true });
});


export default app;