import { Router } from "express";
import { Product } from "../models/index.js";

const router = Router();

// Helpers
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// GET /products
router.get("/", async (req, res) => {
  try {
    const items = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Error listando productos" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(item);
  } catch (err) {
    console.error("GET /products/:id error:", err);
    res.status(500).json({ error: "Error obteniendo producto" });
  }
});

// POST /products
router.post("/", async (req, res) => {
  try {
    const { name, sku, price, stock, active } = req.body;

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: "name es requerido (mín 2 caracteres)" });
    }

    const created = await Product.create({
      name: String(name).trim(),
      sku: sku ? String(sku).trim() : null,
      price: toNumber(price, 0),
      stock: Math.trunc(toNumber(stock, 0)),
      active: active ?? true,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("POST /products error:", err);
    // Error común: SKU duplicado
    if (String(err?.name).includes("SequelizeUniqueConstraintError")) {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    res.status(500).json({ error: "Error creando producto" });
  }
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });

    const { name, sku, price, stock, active } = req.body;

    if (name !== undefined) item.name = String(name).trim();
    if (sku !== undefined) item.sku = sku ? String(sku).trim() : null;
    if (price !== undefined) item.price = toNumber(price, 0);
    if (stock !== undefined) item.stock = Math.trunc(toNumber(stock, 0));
    if (active !== undefined) item.active = Boolean(active);

    await item.save();
    res.json(item);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    if (String(err?.name).includes("SequelizeUniqueConstraintError")) {
      return res.status(409).json({ error: "SKU ya existe" });
    }
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  try {
    const item = await Product.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });

    await item.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

export default router;
