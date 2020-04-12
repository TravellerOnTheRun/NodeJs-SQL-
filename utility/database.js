const Sequelize = require('sequelize');

const sequelize = new Sequelize('first-schema', 'root', 'aleks1999', { 
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;