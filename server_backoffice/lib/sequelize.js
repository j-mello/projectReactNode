const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});

connection.authenticate();

module.exports = connection;
