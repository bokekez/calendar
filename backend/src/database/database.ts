import { Sequelize, Dialect } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./models/User"; // import your model(s) here

dotenv.config();

const dialect = (process.env.DB_DIALECT as Dialect) || "postgres";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect,
  models: [User], 
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

export default sequelize;
