const express = require('express');
const {
    projectsHome,
    projectForm,
    newProject,
    projectByUrl,
    projectEdit,
    updateProject,
    deleteProject } = require('../controllers/projectsController');
const {
    newTask,
    changeTaskStatus,
    deleteTask,
    editTask,
    updateTask } = require('../controllers/tasksController');
const {
    formNewAccount,
    createNewAccount,
    formSessionInit,
    resetPasswordForm } = require('../controllers/usersController');

const {
    userAuth,
    userIsAuth,
    closeSession,
    sendToken,
    resetPassword,
    changePassword,
    activateAccount } = require('../controllers/authController');

const router = express.Router();

// import express-validator
const { body } = require('express-validator');

module.exports = function () {
    // Home route
    router.get('/',
        userIsAuth,
        projectsHome
    );
    // Show new project Form
    router.get('/nuevo-proyecto',
        userIsAuth,
        projectForm
    );
    // Add new project
    router.post('/nuevo-proyecto',
        userIsAuth,
        body('name').not().isEmpty().trim().escape(),
        newProject
    );
    // Show a spacific project by url
    router.get('/proyectos/:url',
        userIsAuth,
        projectByUrl
    );
    // Show a specific project by Id to modify its name
    router.get('/proyecto/editar/:id',
        userIsAuth,
        projectEdit
    );
    // Update the project name
    router.post('/nuevo-proyecto/:id',
        userIsAuth,
        body('name').not().isEmpty().trim().escape(),
        updateProject
    );
    // Delete the project 
    router.delete('/proyectos/:url',
        userIsAuth,
        deleteProject
    );

    // Routes for tasks
    // Add task 
    router.post('/proyectos/:url',
        userIsAuth,
        body('taskname').not().isEmpty().trim().escape(),
        newTask
    );
    // To change task status
    router.patch('/task/:id',
        userIsAuth,
        changeTaskStatus
    );
    // To delete task 
    router.delete('/task/:id',
        userIsAuth,
        deleteTask
    );
    // Show a specific task to edit its name
    router.get('/proyectos/:url/:id',
        userIsAuth,
        editTask
    );
    // Update the specific task once edited
    router.post('/proyectos/:url/:id',
        userIsAuth,
        updateTask
    );

    // Routes for users
    // Create a new account
    router.get('/crear-cuenta', formNewAccount)
    router.post('/crear-cuenta', createNewAccount)
    // Session Init form
    router.get('/iniciar-sesion', formSessionInit)
    // Session Init verification
    router.post('/iniciar-sesion', userAuth)
    // Session close
    router.get('/cerrar-sesion', closeSession)
    // Reset password form
    router.get('/restablecer', resetPasswordForm)
    // Send token to Reset password 
    router.post('/restablecer', sendToken)
    // Asking for new password 
    router.get('/restablecer/:token', resetPassword)
    // changing new password 
    router.post('/restablecer/:token', changePassword)
    // Activate new account 
    router.get('/activar-cuenta/:token', activateAccount)


    return router;
}
