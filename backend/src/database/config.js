require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL || null;

module.exports = {
  development: databaseUrl
    ? {
        url: databaseUrl,
        dialect: "postgres",
        dialectOptions: {},
      }
    : {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
      },

  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT,
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {},
  },
};
