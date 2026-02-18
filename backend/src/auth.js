import jwt from "jsonwebtoken";


export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en variables de entorno.");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}


export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token" });


    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Falta JWT_SECRET en variables de entorno.");


    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}