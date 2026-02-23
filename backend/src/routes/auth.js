import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en variables de entorno (Railway).");

  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    secret,
    { expiresIn: "7d" }
  );
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, rol } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email y password son obligatorios" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: "Ese email ya existe" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre: name,
      email,
      password_hash,
      rol: rol || "Producción",
    });

    const token = signToken(user);

    return res.json({
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error registrando usuario" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email y password son obligatorios" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken(user);

    return res.json({
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en login" });
  }
});

export default router;
