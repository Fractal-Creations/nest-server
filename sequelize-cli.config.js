// sequelize-cli.config.js
const path = require('path');

// Определяем окружение
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.production.env' : '.development.env';

require('dotenv').config({ path: path.resolve(__dirname, envFile) });
require('ts-node').register({
  transpileOnly: true,
  project: './tsconfig.json',
});

module.exports = {
  'development': {
    username: process.env.POSTGRES_USER ,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB ,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrationsPath: 'src/core/database/migrations',
    logging: console.log,
  },
  'production': {
    username: process.env.POSTGRES_USER ,
    password: process.env.POSTGRES_PASSWORD ,
    database: process.env.POSTGRES_DB ,
    host: process.env.POSTGRES_HOST ,
    port: process.env.POSTGRES_PORT ,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrationsPath: 'src/core/database/migrations',
    logging: false,
  }
};