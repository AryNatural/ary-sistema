import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: true, unique: true },

    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);
