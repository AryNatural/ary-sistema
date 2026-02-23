import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    sku: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    categoria: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "General" },

    presentacion_ml: { type: DataTypes.INTEGER, allowNull: true },

    costo: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "products" }
);
