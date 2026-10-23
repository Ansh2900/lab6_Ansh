const Sequelize = require("sequelize");

const sequelize = new Sequelize(null, null, null, {
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false,
});

module.exports = sequelize;
