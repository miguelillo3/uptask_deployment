const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

// Database connection
const db = require('../config/db');
// Due an User can create projects, import the Project model
const Projects = require('../models/Projects');

// The model Users definition
const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'El Email no es válido'
            },
            notEmpty: {
                msg: 'Debe suministrar el Email'
            }
        },
        unique: {
            args: true,
            msg: 'Este Email ya existe'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe suministrar la Contraseña'
            }
        }
    },
    active: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE 
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
}
);

// own users functions
// Verifying password on session init
Users.prototype.passwordVerify = function(password){
    return bcrypt.compareSync(password, this.password); // true
}


Users.hasMany(Projects);

module.exports = Users;
