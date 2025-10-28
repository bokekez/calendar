require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || null;

module.exports = {
  development: databaseUrl
    ? {
        url: databaseUrl,
        dialect: 'postgres',
        dialectOptions: {},
      }
    : {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'speckdb',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
      },

  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'speckdb_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {},
  },
};
