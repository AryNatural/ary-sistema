import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productsRouter from "./routes/products.js";
import authRoutes from "./routes-auth.js";
...
app.use("/auth", authRoutes);


const app = express();


app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/products", productsRouter);


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

app.get("/api", (req, res) => {
  res.json({ ok: true, service: "ary-sistema-backend" });
});



