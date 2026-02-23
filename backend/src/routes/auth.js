import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, nombre, email, password } = req.body;

  const realName = (name || nombre || "").trim();
  const realEmail = (email || "").trim().toLowerCase();
  const realPass = password || "";

  if (!realName || !realEmail || realPass.length < 4) {
    return res.status(400).json({ error: "Datos inválidos (name/email/password)." });
  }

  const exists = await User.findOne({ where: { email: realEmail } });
  if (exists) return res.status(409).json({ error: "Email ya registrado." });

  const passwordHash = await bcrypt.hash(realPass, 10);

  const user = await User.create({
    nombre: realName,
    email: realEmail,
    passwordHash,
    rol: "Producción",
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    token,
  });
});

router.post("/login", async (req, res) => {
  const realEmail = (req.body.email || "").trim().toLowerCase();
  const realPass = req.body.password || "";

  const user = await User.findOne({ where: { email: realEmail } });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas." });

  const ok = await bcrypt.compare(realPass, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas." });

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    token,
  });
});

export default router;
