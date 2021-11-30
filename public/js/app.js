import projects from './modules/projects';
import tasks from './modules/tasks';
import {tasksProgress} from './functions/progress';

document.addEventListener('DOMContentLoaded', () => {
    tasksProgress();
});