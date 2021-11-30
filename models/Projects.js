const { Sequelize } = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

// Database connection
const db = require('../config/db');

// The model Projects definition
const Projects = db.define('projects', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : Sequelize.STRING,
    url : Sequelize.STRING
}, {
    hooks : {
        beforeCreate(project) {
            const url = slug(project.name).toLowerCase();
            project.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Projects;