// Option 3: Passing parameters separately (other dialects)
const { Sequelize } = require('sequelize');
// Getting environment values
require('dotenv').config({ path: 'variables.env'});

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

module.exports = db;