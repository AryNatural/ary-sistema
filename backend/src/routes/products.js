import express from "express";
import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

const router = express.Router();

// Modelo Product (simple, para arrancar)
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    categoria: { type: DataTypes.STRING, allowNull: false, defaultValue: "General" },
    presentacionML: { type: DataTypes.INTEGER, allowNull: true },
    costo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    precio: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "products" }
);

// GET /products  -> lista
router.get("/", async (req, res) => {
  const items = await Product.findAll({ order: [["createdAt", "DESC"]] });
  res.json(items);
});

// POST /products -> crear
router.post("/", async (req, res) => {
  const { sku, nombre, categoria, presentacionML, costo, precio } = req.body;

  if (!sku || !nombre) {
    return res.status(400).json({ error: "sku y nombre son obligatorios" });
  }

  const created = await Product.create({
    sku,
    nombre,
    categoria: categoria || "General",
    presentacionML: presentacionML ? Number(presentacionML) : null,
    costo: costo ? Number(costo) : 0,
    precio: precio ? Number(precio) : 0,
  });

  res.status(201).json(created);
});

export default router;
