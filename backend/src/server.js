import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./db.js";

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

try {
  await sequelize.authenticate();
  console.log("✅ DB conectada correctamente");

  app.listen(PORT, HOST, () => {
    console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
  });
} catch (err) {
  console.error("❌ Error conectando a la DB:", err);
  process.exit(1);
}
