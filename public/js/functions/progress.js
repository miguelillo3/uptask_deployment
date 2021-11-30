import Swal from "sweetalert2";
export const tasksProgress = () => {
    // Getting the tasks amount
    const totalTasks = document.querySelectorAll('.listado-pendientes li.tarea').length;
    if (totalTasks > 0) {
        // const completed = tasksProgress.querySelectorAll('i.completo');
        // Getting the tasks completed amount
        const completedTasks = document.querySelectorAll('.listado-pendientes i.completo').length;
        const percentage = Math.round(completedTasks / totalTasks * 100)
        const elementPerc = document.querySelector('#porcentaje');
        elementPerc.style["width"] = `${percentage}%`;
        if (percentage === 100) {
            Swal.fire({title: 'Completado!',
                text: `Felicitaciones, el proyecto fue completado satisfactoriamente`,
                icon: 'success', timer: 3000})
        }
    }
}
