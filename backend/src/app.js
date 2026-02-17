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

app.get("/", (req, res) => {
  res.send("ARY-SISTEMA API ONLINE ✅");
});

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "API funcionando ✅" });
});
