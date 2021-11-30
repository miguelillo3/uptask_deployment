import Swal from "sweetalert2";
import axios from "axios";
import {tasksProgress} from '../functions/progress';

// Getting the list tasks DOM element 
const tasks = document.querySelector('.listado-pendientes');
if (tasks) {
    // If exist then add event listener
    tasks.addEventListener('click', e => {
        // To change task status
        if (e.target.classList.contains('fa-check-circle')) {
            const element = e.target;
            const tasksid = element.parentElement.parentElement.dataset.taskid;

            // Making a patch request to /task/:id
            const url = `${location.origin}/task/${tasksid}`;
            axios.patch(url, { tasksid })
                .then(response => {
                    if (response.status === 200) {
                        // toggle the class to the element
                        element.classList.toggle('completo');
                        tasksProgress();
                    }
                })
                .catch(error => console.log(error))
        }

        // To delete task
        if (e.target.classList.contains('fa-trash')) {
            Swal.fire({
                title: 'Seguro de eliminar estos datos?',
                text: "No se podrá revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
                cancelButtonText: 'Cancelar',

            }).then((result) => {
                if (result.isConfirmed) {
                    const element = e.target;
                    const tasksid = element.parentElement.parentElement.dataset.taskid;
                    const taskname = element.parentElement.parentElement.firstElementChild.textContent;
                    const projectUrl = element.parentElement.parentElement.dataset.url;
                    // Making a request to /task/:id
                    const url = `${location.origin}/task/${tasksid}`;
                    axios.delete(url, {params: { tasksid, taskname }} )
                        .then(function (response) {
                            Swal.fire('Eliminado!', 
                            `La tarea <b>${taskname}</b> fue eliminada satisfactoriamente`, 
                            'success')
                            // Redirect the user after 3 secs
                            setTimeout(() => {
                                window.location.href = `/proyectos/${projectUrl}`;
                            }, 3000);
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops... Hubo un error',
                                text: 'No se pudo eliminar la información'
                            })
                        });
                };
            })
        }
    })
}

export default tasks;