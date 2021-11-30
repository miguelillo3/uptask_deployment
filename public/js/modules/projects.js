import Swal from "sweetalert2";
import axios from "axios";

const btnDeleteProject = document.querySelector('#eliminar-proyecto');

// if there is btnDeleteProject
if (btnDeleteProject) {

    btnDeleteProject.addEventListener('click', e => {
        Swal.fire({
            title: 'Está seguro de eliminar estos datos?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',

        }).then((result) => {
            if (result.isConfirmed) {
                const urlProject = e.target.dataset.projectUrl;
                const url = `${location.origin}/proyectos/${urlProject}`;
                axios.delete(url, {params: {urlProject}})
                    .then(function(response){
                        Swal.fire( 'Eliminado!', response.data, 'success' )
                            // Redirect the user after 3 secs
                            setTimeout(() => {
                                window.location.href = '/';
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
    });
}

export default btnDeleteProject;