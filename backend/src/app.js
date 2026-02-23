import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import productsRouter from "./routes/products.js";
const app = express();

app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

// Rutas
app.use("/products", productsRouter);

export default app;


