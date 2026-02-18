import { Router } from "express";
import { Product } from "../models/index.js";


const router = Router();


// GET /products
router.get("/", async (req, res) => {
  const items = await Product.findAll({ order: [["createdAt", "DESC"]] });
  res.json(items);
});


// POST /products
router.post("/", async (req, res) => {
  const { name, sku, price, stock } = req.body;
  const created = await Product.create({ name, sku, price, stock });
  res.status(201).json(created);
});


export default router;