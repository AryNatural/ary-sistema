import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";

const router = Router();

// GET /products
router.get("/", requireAuth, async (req, res) => {
  const list = await Product.findAll({ order: [["createdAt", "DESC"]] });
  res.json(list);
});

// POST /products
router.post("/", requireAuth, async (req, res) => {
  const { sku, nombre, categoria, presentacionMl, costo, precio } = req.body;

  if (!sku || !nombre) {
    return res.status(400).json({ error: "Falta sku o nombre." });
  }

  const created = await Product.create({
    sku: String(sku).trim(),
    nombre: String(nombre).trim(),
    categoria: categoria ? String(categoria).trim() : "General",
    presentacionMl: presentacionMl ? Number(presentacionMl) : null,
    costo: costo ? Number(costo) : 0,
    precio: precio ? Number(precio) : 0,
  });

  res.json(created);
});

export default router;
