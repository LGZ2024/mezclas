import { Solicitud } from "./solicitarMescla.js";
import { iniciarMesclas, verMesclaz, iniciarMesclasPreparacion, verMesclazPreparacion,verMesclazEntregadas,iniciarMesclasEntregadas} from "../app/tablaMesclaSolicita.js";
import { centrosCoste, Variedades } from "./CentrosCoste.js"
import { camara,detenerCamara} from "./camara.js"

//CREAMOS SOLICITUD
function solicitarMescla(idUSuario, nombreUsuario) {
    const solicita = document.getElementById('solicitar');
    solicita.addEventListener('click', async () => {
        document.getElementById('opciones').style.display = "none";
        document.getElementById('SecMesclaz').style.display = "block";
        camara()
    });
    Solicitud(idUSuario, nombreUsuario)
}

//CREAMOS BOTON PARA REGRESAR 
function regresarF() {
    const regresar = document.getElementById('regresarf');
    regresar.addEventListener('click', () => {
        document.getElementById('SecMesclaz').style.display = "none";
        document.getElementById('opciones').style.display = "block";
        detenerCamara()
    });
}

/* mostrar tabla de solicitudes en proceso */
function tbSolicitada(id_usuario) {
    const tbSolicitada = document.getElementById('tbSolicitada');
    tbSolicitada.addEventListener('click', () => {
        document.getElementById('opciones').style.display = "none";
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
        }
        iniciarMesclas(id_usuario, 'Solicitada')
        verMesclaz()
    });
}

/* regresa vista de solicitud */
function regresarO() {
    const regresar = document.getElementById('regresarO');
    regresar.addEventListener('click', () => {
        document.getElementById('tablaMesclaSolicitada').style.display = "none";
        document.getElementById('opciones').style.display = "block";
    });
}

/* mostar tabla de solicitudes preparadas */
function tbPreparacion(id_usuario) {
    const preparadas = document.getElementById('tbPreparada');
    preparadas.addEventListener('click', () => {
        document.getElementById('opciones').style.display = "none";
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
        }
        iniciarMesclasPreparacion(id_usuario, 'preparacion')
        verMesclazPreparacion()
    });
}

/* regresa a opciones solicitud */
function regresarP() {
    const regresar = document.getElementById('regresarP');
    regresar.addEventListener('click', () => {
        document.getElementById('opciones').style.display = "block";
        document.getElementById('tabladeMezclaPreparacion').style.display = "none";
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
        }
    });
}


/*mostar tablas entregadas  */
function tbEntregada(id_usuario){
    const preparadas = document.getElementById('tbEntregadas');
    preparadas.addEventListener('click', () => {
        document.getElementById('opciones').style.display = "none";
        document.getElementById('tabladeMezclaEntredas').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
        }
        iniciarMesclasEntregadas(id_usuario, 'entregada')
        verMesclazEntregadas()
    });
}
/* regresa a opciones solicitud */
function regresarTP() {
    const regresar = document.getElementById('regresarS');
    regresar.addEventListener('click', () => {
        document.getElementById('opciones').style.display = "block";
        document.getElementById('tabladeMezclaEntredas').style.display = "none";
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
        }
    });
}








/*funciones de selects  */
async function ranchoDestino() {
    const selectElemento = document.querySelector("#rancho");
    selectElemento.addEventListener("change", (event) => {
        const rancho = event.target.value;
        try {
            centrosCoste(rancho)
        } catch (error) {
            console.error(error);
        }
    });
}

async function centroCoste() {
    const selectElemento = document.querySelector("#centroCoste");
    selectElemento.addEventListener("change", (event) => {
        const centroCoste = event.target.value;
        try {
            Variedades(centroCoste)
        } catch (error) {
            console.error(error);
        }
    });
}


async function CargarImagen() {
    document.getElementById('imageFile').addEventListener('change', handleFileSelect, false);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Crear un canvas y redimensionar la imagen
                const canvas1 = document.getElementById('canvas1');
                const ctx = canvas1.getContext('2d');
                const MAX_WIDTH = 640;
                const MAX_HEIGHT = 480;

                // Obtener las dimensiones de la imagen
                let width = img.width;
                let height = img.height;

                // Calcular las nuevas dimensiones manteniendo la proporción
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = width * (MAX_HEIGHT / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas1.width = width;
                canvas1.height = height;
                ctx.drawImage(img, 0, 0);
                const base64Image = canvas1.toDataURL('image/png');
                document.getElementById('canvas1').style.display = 'block';
                document.getElementById('fileInput').value = base64Image;
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// funciones de foto
function abrirTomarFoto() {
    const btnTomarFoto = document.getElementById('tomarFoto');
    btnTomarFoto.addEventListener('click', () => {
        document.getElementById('InputImage').style.display = "block";
        document.getElementById('fileImage').style.display = "none";
    })
}
function abrirfileFoto() {
    const btnfileFoto = document.getElementById('subirFoto');
    btnfileFoto.addEventListener('click', () => {
        document.getElementById('InputImage').style.display = "none";
        document.getElementById('fileImage').style.display = "block";
    })
}




export { solicitarMescla, regresarF, tbSolicitada, regresarO, tbPreparacion, regresarP, ranchoDestino, centroCoste, abrirTomarFoto, abrirfileFoto, CargarImagen,tbEntregada,regresarTP}