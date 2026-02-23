import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("Admin", "Ventas", "Bodega", "Contabilidad"),
      allowNull: false,
      defaultValue: "Ventas"
    }
  },
  { tableName: "users" }
);
