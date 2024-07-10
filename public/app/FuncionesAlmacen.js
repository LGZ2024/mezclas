import { iniciarMesclasaAlmacen, verMesclazAlmecen, iniciarMesclasPreparacion, verMesclazPreparacion, iniciarMesclasEntregadas, verMesclazEntregadas } from "./tablaMesclaAlmacen.js";
import { mostrarMensaje } from "./mensajes.js";
import { continuarVideosC } from './camara.js';
import { camaraC, detenerCamaraC } from "./camara.js"


//funcuines de los botones principales
function solicitaMesclaAlmacen(empresaPertece) {
    const solicita = document.getElementById('btnTablaSolicidata');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-almacen').style.display = "none";
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        iniciarMesclasaAlmacen(empresaPertece)
        verMesclazAlmecen()
        // guardar(id_usuario,empresaPertece)
    });
}
function preparadaMesclaAlmacen(empresaPertece) {
    const solicita = document.getElementById('btnTablaPreparadas');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-almacen').style.display = "none";
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        iniciarMesclasPreparacion(empresaPertece)
        verMesclazPreparacion()
    });
}
function entregadaMesclaAlmacen(empresaPertece) {
    const solicita = document.getElementById('btnTablaEntragadas');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-almacen').style.display = "none";
        document.getElementById('tabladeMezclaEntredas').style.display = "block";
        iniciarMesclasEntregadas(empresaPertece)
        verMesclazEntregadas()
    });
}



//funciones de regresa
function regresarSA() {
    const regresar = document.getElementById('regresarO');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
            document.getElementById('tablaMesclaSolicitada').style.display = "none";
            document.getElementById('opciones-almacen').style.display = "block";
        }
    });
}
function regresarPA() {
    const regresar = document.getElementById('regresarP');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
            document.getElementById('opciones-almacen').style.display = "block";
            document.getElementById('tabladeMezclaPreparacion').style.display = "none";
        }
    });
}
function regresarEA() {
    const regresar = document.getElementById('regresarS');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
            document.getElementById('opciones-almacen').style.display = "block";
            document.getElementById('tabladeMezclaEntredas').style.display = "none";

        }
    });
}




//funciones de las tablas
async function abrirMezcla(idUsuario) {
    const response = await fetch(`/mezclasId/${idUsuario}`);
    const data = await response.json();
    console.log(data)
    /* pasamos los valores obtenidos*/
    document.getElementById('solicitai').value = data[0].Solicita;
    document.getElementById('fechai').value = data[0].fechaSolicitud;
    document.getElementById('ranchoi').value = data[0].ranchoDestino;
    document.getElementById('empresai').value = data[0].empresa;
    document.getElementById('centroCostei').value = data[0].centroCoste;
    document.getElementById('variedadi').value = data[0].variedad;
    document.getElementById('folioi').value = data[0].FolioReceta;
    document.getElementById('temporadai').value = data[0].temporada;
    document.getElementById('cantidadi').value = data[0].cantidad;
    document.getElementById('presentacioni').value = data[0].prensetacion;
    document.getElementById('metodoi').value = data[0].metodoAplicacion;
    document.getElementById('descripcioni').value = data[0].descripcion;

    ///
    document.getElementById('tablaMesclaSolicitada').style.display = "none";
    document.getElementById('formPreparadas').style.display = "block";

    //agregar bonton con  funcion y imagen
    const btnRecetaDiv = document.getElementById('btnReceta');
    const foto = data[0].imagen;
    btnRecetaDiv.innerHTML = `<button type="button" class="formulario__submit" onclick="Receta('${foto}')">Abrir Receta</button>`;

}
function abrirReceta(foto) {
    Enlace(foto, 'receta', 'jpg')
}
const guardarMezcla = (idUsuario, empresaPertece) => {
    const guardar = document.getElementById('btnGuardarMescla');
    guardar.addEventListener('click', async () => {
        const folio = document.getElementById('folioi').value;
        const notaMezcla = document.getElementById('notaMezcla').value;
        try {

            const response = await fetch(`/mezclasAlmacen/${idUsuario}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folio: folio,
                    notaMezcla: notaMezcla,
                    status: 'preparacion'
                })
            });
            const data = await response.json();
            console.log(data);

            if (data.message === 'ok') {
                mostrarMensaje('guardado con exito', 'success')
                limpiarForm()
                if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
                    $('#tbSolicitadas').DataTable().destroy();
                    document.getElementById('tablaMesclaSolicitada').style.display = "block";
                    document.getElementById('formPreparadas').style.display = "none";
                    iniciarMesclasaAlmacen(empresaPertece)
                    verMesclazAlmecen()
                }



            }
        } catch (error) {
            alert('Error: ' + error)
            console.log(error)
        }

    })
}
function regresarTbs() {
    const regresar = document.getElementById('regresaPrepa');
    regresar.addEventListener('click', () => {
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        document.getElementById('formPreparadas').style.display = "none";
        limpiarForm()
    });
}
function limpiarForm() {
    document.getElementById('solicitai').value = '';
    document.getElementById('fechai').value = '';
    document.getElementById('ranchoi').value = '';
    document.getElementById('empresai').value = '';
    document.getElementById('centroCostei').value = '';
    document.getElementById('variedadi').value = '';
    document.getElementById('folioi').value = '';
    document.getElementById('temporadai').value = '';
    document.getElementById('cantidadi').value = '';
    document.getElementById('presentacioni').value = '';
    document.getElementById('metodoi').value = '';
    document.getElementById('descripcioni').value = '';
    document.getElementById('notaMezcla').value = '';

    //agregar bonton con  funcion y imagen
    const btnRecetaDiv = document.getElementById('btnReceta');
    btnRecetaDiv.innerHTML = '';
}


//funciones de cerrar mezcla
function abrirFormCerrar(idMescla) {
    document.getElementById('tabladeMezclaPreparacion').style.display = "none";
    document.getElementById('formCerrar').style.display = "block";
    document.getElementById('idMesclas').value = idMescla;
}

async function CerrarMezcla(empresaPertece) {
    const cerrarMescla = document.getElementById('btnEntregada')
    cerrarMescla.addEventListener('click', async () => {
        const idMesclas = document.getElementById('idMesclas').value;
        const imagenEntregado = document.getElementById('imagenEntrega').value;
        if (idMesclas == "" || imagenEntregado == "") {
            return mostrarMensaje('favor de completar todos los campos')
        }

        const formData = new FormData();
        formData.append('idMesclas', idMesclas);
        formData.append('imagen', imagenEntregado);
        try {
            const options = {
                method: "POST",
                body: formData
            };
            const response = await fetch(`/mezclasAlmacen`, options);
            const data = await response.json()
            console.log(data)
            if (data.message === 'ok') {
                mostrarMensaje('guardado con exito', 'success')
                limpiarFormCerrar(empresaPertece)
            }
            // pasamos el documeto al la funcion para actualizar el estado


        } catch (error) {
            console.log(error);
        }
    });
}
function limpiarFormCerrar(empresaPertece) {
    document.getElementById('idMesclas').value = "";
    document.getElementById('imagenEntrega').value = "";
    document.getElementById('imageFileC').value=""

    document.getElementById('InputImageC').style.display="none"
    document.getElementById('fileImageC').style.display="none"
    if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
        $('#tbPreparadas').DataTable().destroy();
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        document.getElementById('formCerrar').style.display = "none";
        iniciarMesclasPreparacion(empresaPertece)
        verMesclazPreparacion()
    }
    continuarVideosC()
    detenerCamaraC()
}

function regresarCerrar(empresaPertece) {
    const regresar = document.getElementById('regresarCerrar');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
            document.getElementById('tabladeMezclaPreparacion').style.display = "block";
            document.getElementById('formCerrar').style.display = "none";
            iniciarMesclasPreparacion(empresaPertece)
            verMesclazPreparacion()
            detenerCamaraC()
        }
    });
}

//funciones de cerrar mezc
const Enlace = (enlace, descripcion, tipo) => {
    // Verificar si la ruta del archivo existe
    fetch(enlace, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // La ruta del archivo existe, procede a abrir el modal
                $('#pdfEmbed').attr('src', enlace);
                $('#pdfModalLabel').text(`Visualizar ${tipo} - ${descripcion}`);
                $('#pdfModal').modal('show', { backdrop: 'static', keyboard: false });
            } else {
                // La ruta del archivo no existe, muestra un SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El archivo no existe.',
                });
            }
        })
        .catch(error => {
            console.error('Error:');
        });
}


// funciones de foto
async function CargarImagenC() {
    document.getElementById('imageFileC').addEventListener('change', handleFileSelect, false);

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
                const canvas1 = document.getElementById('canvas2');
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
                document.getElementById('canvas2').style.display = 'block';
                document.getElementById('imagenEntrega').value = base64Image;
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}
function abrirTomarFotoC() {
    const btnTomarFoto = document.getElementById('tomarFotoC');
    btnTomarFoto.addEventListener('click', () => {
        document.getElementById('InputImageC').style.display = "block";
        document.getElementById('fileImageC').style.display = "none";
        camaraC()
    })
}
function abrirfileFotoC() {
    const btnfileFoto = document.getElementById('subirFotoC');
    btnfileFoto.addEventListener('click', () => {
        document.getElementById('InputImageC').style.display = "none";
        document.getElementById('fileImageC').style.display = "block";
    })
}


export { solicitaMesclaAlmacen, regresarSA, preparadaMesclaAlmacen, regresarPA, entregadaMesclaAlmacen, regresarEA, abrirMezcla, abrirReceta, regresarTbs, guardarMezcla, regresarCerrar, CerrarMezcla, CargarImagenC, abrirTomarFotoC, abrirfileFotoC, abrirFormCerrar }