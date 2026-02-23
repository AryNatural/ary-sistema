import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./db.js";

const PORT = Number(process.env.PORT || 8080);
const HOST = "0.0.0.0";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    await sequelize.sync();
    console.log("✅ Tablas sincronizadas (sync)");

    app.listen(PORT, HOST, () => {
      console.log(`✅ API corriendo en http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando/levantando API:", err);
    process.exit(1);
  }
}

start();
