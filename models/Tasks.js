const { Sequelize } = require('sequelize');
const Projects = require('./Projects');

// Database connection
const db = require('../config/db');

// The model definition
const Tasks = db.define('tasks', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    taskname: Sequelize.STRING(100),
    taskstatus: Sequelize.INTEGER(1)
});
Tasks.belongsTo(Projects);

module.exports = Tasks;