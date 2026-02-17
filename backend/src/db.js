import { Sequelize } from "sequelize";


const DATABASE_URL = process.env.DATABASE_URL;


if (!DATABASE_URL) {
  throw new Error("Falta DATABASE_URL en variables de entorno (Railway).");
}


export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production"
      ? { require: true, rejectUnauthorized: false }
      : false
  }
});