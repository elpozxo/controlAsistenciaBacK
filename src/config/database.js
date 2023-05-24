const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pruebaacceso', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
