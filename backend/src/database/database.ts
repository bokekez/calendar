import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
  models: [path.resolve(__dirname, "models")], // <-- auto-discovery
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

export default sequelize;
