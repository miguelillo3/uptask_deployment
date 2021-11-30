// Import the project and task model
const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');
const Users = require('../models/Users');

exports.projectsHome = async (req, res) => {
    const { id } = res.locals.user;
    const projects = await Projects.findAll({ where: { userId: id } });
    res.render('index', {
        pageName: 'Gestión de Proyectos',
        projects
    });
}

exports.projectForm = async (req, res) => {
    const { id } = res.locals.user;
    const projects = await Projects.findAll({ where: { userId: id } });
    res.render('newProject', {
        pageName: 'Crear Nuevo Proyecto',
        projects
    });
}

exports.newProject = async (req, res) => {
    // Destructuring the input fields
    const { name } = req.body;
    let errors = [];
    if (!name.trim()) {
        errors.push({ 'text': 'El nombre del proyecto es obligatorio' });
    }
    // If there is errors
    if (errors.length > 0) {
        const { id } = res.locals.user;
        const projects = await Projects.findAll({ where: { userId: id } });
        // the errors array are send to the view
        res.render('nuevoProyecto', {
            pageName: 'Crear Nuevo Proyecto',
            errors,
            projects
        });
    } else {
        // Insert the project into the db
        try {
            // Getting the user id insert it into projects model
            const { id } = res.locals.user;
            await Projects.create({ name, userId: id });
            res.redirect('/');
        } catch (error) {
            console.log(error)
        }
    }
};

exports.projectByUrl = async (req, res, next) => {
    const { id } = res.locals.user;
    const projectsQuery = Projects.findAll({ where: { userId: id } });
    const projectQuery = Projects.findOne({
        where: { url: req.params.url }
    })

    const [projects, project] = await Promise.all([projectsQuery, projectQuery]);

    if (!project) return next();

    // Retrieve the tasks for the specified project 
    const tasks = await Tasks.findAll({
        where: { projectId: project.id }
    });

    res.render('tasks', {
        pageName: 'Tareas del Proyecto',
        project,
        projects,
        tasks
    });
}

exports.projectEdit = async (req, res, next) => {
    const { id } = res.locals.user;
    const projectsQuery = Projects.findAll({ where: { userId: id } });
    const projectQuery = Projects.findOne({
        where: { id: req.params.id }
    })

    const [projects, project] = await Promise.all([projectsQuery, projectQuery]);

    if (!project) return next();
    res.render('newProject', {
        pageName: 'Editar Proyecto',
        project,
        projects
    });
}

exports.updateProject = async (req, res) => {

    // Destructuring the input fields
    const { name, url } = req.body;
    let errors = [];
    if (!name.trim()) {
        errors.push({ 'text': 'El nombre del proyecto es obligatorio' });
    }
    // If there is errors
    if (errors.length > 0) {
        const { id } = res.locals.user;
        const projects = await Projects.findAll({ where: { userId: id } });
        // the errors array are send to the view
        res.render('nuevoProyecto', {
            pageName: 'Crear Nuevo Proyecto',
            errors,
            projects
        });
    } else {
        // Update the project into the db
        try {
            await Projects.update(
                { name },
                { where: { id: req.params.id } }
            );
            res.redirect('/proyectos/' + url);
        } catch (error) {
            console.log(error)
        }
    }
};

exports.deleteProject = async (req, res, next) => {
    // req conains query and params, and is the same data
    const { urlProject } = req.params;
    const result = await Projects.destroy(
        { where: { url: urlProject } }
    );
    if (!result) {
        return next();
    }
    res.status(200).send('El proyecto fue eliminado satisfactoriamente');
};

