import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


const router = Router();


function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en Railway.");
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos: name, email, password" });
    }


    const exists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ error: "Ese email ya existe" });


    const password_hash = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash,
      role: role || "Ventas"
    });


    const token = signToken(user);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error registrando usuario" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
import jwt from "jsonwebtoken";


export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;


    if (!token) return res.status(401).json({ error: "Falta token (Bearer)" });


    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "Falta JWT_SECRET en Railway" });


    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}