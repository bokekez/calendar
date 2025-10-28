import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./database/database";
import router from "./routes/routes";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const app = express();
app.set("trust proxy", true);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.get("/health", (_req, res) => res.json({ ok: true }));

async function start() {
  try {
    console.log("[APP] NODE_ENV =", process.env.NODE_ENV || "undefined");
    console.log(
      "[APP] connecting to DB:",
      process.env.DATABASE_URL
        ? "[DATABASE_URL]"
        : `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    );

    await sequelize.authenticate();
    console.log("[DB] Connection authenticated");

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
      console.log("[DB] Synced models (development mode)");
    }

    app.listen(PORT, () =>
      console.log(`[APP] Server running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error("[APP] Failed to start server", err);
    process.exit(1);
  }
}

start();
