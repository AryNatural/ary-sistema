import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./db.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    // Crea tablas si no existen (para empezar rápido)
    // OJO: luego lo ideal es migraciones, pero por ahora sirve.
    await sequelize.sync({ alter: true });
    console.log("✅ Tablas sincronizadas (sync)");

    app.listen(PORT, HOST, () => {
      console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando/sincronizando la DB:", err);
    process.exit(1);
  }
})();

