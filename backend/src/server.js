import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./db.js";

// Importa modelos para que Sequelize los registre
import "./models/User.js";
import "./models/Product.js";

const PORT = Number(process.env.PORT || 5000);
const HOST = "0.0.0.0";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    await sequelize.sync();
    console.log("✅ Tablas sincronizadas (sync)");

    app.listen(PORT, HOST, () => {
      console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a la DB:", err);
    process.exit(1);
  }
})();
