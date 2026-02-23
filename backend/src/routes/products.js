import { Router } from "express";
import { Product } from "../models/Product.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// todo lo de productos es privado
router.use(requireAuth);

// Crear
router.post("/", async (req, res) => {
  try {
    const { sku, nombre, categoria, presentacion_ml, costo, precio, activo } = req.body;

    if (!sku || !nombre) return res.status(400).json({ error: "sku y nombre son obligatorios" });

    const created = await Product.create({
      sku,
      nombre,
      categoria: categoria || "General",
      presentacion_ml: presentacion_ml ?? null,
      costo: costo ?? 0,
      precio: precio ?? 0,
      activo: activo ?? true,
    });

    res.json({ ok: true, product: created });
  } catch (err) {
    res.status(500).json({ error: "Error creando producto", detail: err.message });
  }
});

// Listar
router.get("/", async (req, res) => {
  const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ ok: true, products });
});

// Ver 1
router.get("/:id", async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No existe" });
  res.json({ ok: true, product: p });
});

// Editar
router.put("/:id", async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No existe" });

  await p.update(req.body);
  res.json({ ok: true, product: p });
});

// Eliminar
router.delete("/:id", async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No existe" });

  await p.destroy();
  res.json({ ok: true });
});

export default router;
