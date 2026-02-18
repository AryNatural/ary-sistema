import express from "express";
import bcrypt from "bcryptjs";
import { sequelize } from "./db.js";
import { signToken } from "./auth.js";


const router = express.Router();


async function findUserByEmail(email) {
  const [rows] = await sequelize.query(
    `SELECT id, name, email, password_hash FROM users WHERE email = :email LIMIT 1`,
    { replacements: { email } }
  );
  return rows[0] || null;
}


router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }


    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "Email ya existe" });


    const password_hash = await bcrypt.hash(password, 10);


    const [rows] = await sequelize.query(
      `INSERT INTO users (name, email, password_hash, created_at, updated_at)
       VALUES (:name, :email, :password_hash, NOW(), NOW())
       RETURNING id, name, email`,
      { replacements: { name, email, password_hash } }
    );


    const user = rows[0];
    const token = signToken({ id: user.id, email: user.email });


    return res.json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: "Error en register" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }


    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });


    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });


    const token = signToken({ id: user.id, email: user.email });


    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch {
    return res.status(500).json({ error: "Error en login" });
  }
});


export default router;