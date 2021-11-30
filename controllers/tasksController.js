const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.newTask = async (req, res, next) => {
    // Retrieve all projects
    const projectsQuery = Projects.findAll();
    const { url } = req.params;
    // Getting the project with comming params url 
    const projectQuery = Projects.findOne({
        where: { url }
    })

    const [projects, project] = await Promise.all([projectsQuery, projectQuery]);

    // Retrieve all tasks for the specified project
    const tasks = await Tasks.findAll({
        where: { projectId: project.id }
    });

    // Getting the taskname
    const { taskname } = req.body;
    // Validating the taskname
    let errors = [];
    if (!taskname.trim()) {
        errors.push({ 'text': 'El nombre de la tarea es obligatorio' });
    }

    if (errors.length > 0) {
        // If there are errors
        // the errors array are send to the view
        res.render('tasks', {
            pageName: 'Tareas del Proyecto',
            errors,
            projects,
            project,
            tasks
        });
    } else {
        // Getting de project id
        const projectId = project.id;

        //Setting the task status in 0 = incomplete
        const taskstatus = 0;

        // Insert the project into the db
        try {
            await Tasks.create({ taskname, taskstatus, projectId });
            // Refresh the task list
            res.redirect(`/proyectos/${url}`);
        } catch (error) {
            console.log(error)
            return next();
        }
    }
}

exports.changeTaskStatus = async (req, res, next) => {
    // Getting the task id
    const { id } = req.params;
    // Retrieve the task
    const task = await Tasks.findOne({ where: { id } });
    if (!task) return next();
    // Change the task status value
    const newstatus = task.taskstatus ? 0 : 1;
    task.taskstatus = newstatus;
    // Save the task status change
    const result = await task.save();
    if (!result) return next();
    res.status(200).send('Actualizado con éxito');
}

exports.deleteTask = async (req, res, next) => {
    // Getting the task id
    const { id } = req.params;

    const result = await Tasks.destroy(
        { where: { id } }
    );
    if (!result) {
        return next();
    }
    res.status(200).send();
}

exports.updateTask = async (req, res, next) => {
    // Getting url project, task id and task name
    const { url, id, taskname } = req.body;

    // Retrieve all projects
    const projectsQuery = Projects.findAll();
    // Getting the project with comming params url to get project id
    const projectQuery = Projects.findOne({
        where: { url }
    })

    const [projects, project] = await Promise.all([projectsQuery, projectQuery]);

    // Get the task
    const task = await Tasks.findOne({ where: { id } });
    // Validating the taskname
    let errors = [];
    if (!taskname.trim()) {
        errors.push({ 'text': 'El nombre de la tarea es obligatorio' });
    }

    if (errors.length > 0) {
        // If there are errors
        // Retrieve all tasks for the specified project
        const tasks = await Tasks.findAll({
            where: { projectId: project.id }
        });

        // the errors array are send to the view
        res.render('tasks', {
            pageName: 'Tareas del Proyecto',
            errors,
            projects,
            project,
            tasks,
            task
        });
    } else {
        try {
            await Tasks.update({ taskname }, { where: { id } });
            // Refresh the task list
            res.redirect(`/proyectos/${url}`);
        } catch (error) {
            console.log(error)
        }
    }
}

exports.editTask = async (req, res, next) => {
    const { url, id } = req.params;
    // Retrieve all projects
    const projectsQuery = Projects.findAll();
    // Retrieve the specific url project
    const projectQuery = Projects.findOne({
        where: { url }
    })

    const [projects, project] = await Promise.all([projectsQuery, projectQuery]);

    // If there are no projects or there is no project return
    if (!projects || !project) return next();
    // Retrieve all tasks for the specified project
    const tasksQuery = Tasks.findAll({
        where: { projectId: project.id }
    });
    // Retrieve the task with the id sended
    const taskQuery = Tasks.findOne({
        where: { id }
    })

    const [tasks, task] = await Promise.all([tasksQuery, taskQuery]);

    // If there are no tasks or there is no task return
    if (!tasks || !task) return next();
    res.render('tasks', {
        pageName: 'Tareas del Proyecto',
        project,
        projects,
        tasks,
        task
    });
}

