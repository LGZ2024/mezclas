import { mostrarMensaje } from "./mensajes.js";
import { continuarVideos,detenerCamara } from './camara.js';
/* CREAR SOLICITUD */
export function Solicitud(idUSuario, nombreUsuario) {
    const solicita = document.getElementById('btnSolicitar');
    solicita.addEventListener('click', async () => {
        /* bolquemos boton */
        document.getElementById('btnSolicitar').disabled = true;
        document.getElementById('btnSolicitar').innerHTML = "Cargando...";
        /* obtenemos los datos */
        const rancho = document.getElementById('rancho').value;
        const centroCoste = document.getElementById('centroCoste').value;
        const variedad = document.getElementById('variedad').value;
        const folio = document.getElementById('folio').value;
        const temporada = document.getElementById('temporada').value;
        const cantidad = document.getElementById('cantidad').value;
        const prensetacion = document.getElementById('presentacion').value;
        const metodoAplicacion = document.getElementById('metodoAplicacion').value;
        const descripcion = document.getElementById('descripcion').value;
        const imagen = document.getElementById('fileInput').value;
        if (rancho == "" || centroCoste == "" || variedad == "" || folio == "" || temporada == "" || cantidad == "" || prensetacion == "" || metodoAplicacion == "" || descripcion == "" || imagen == "") {
            document.getElementById('btnSolicitar').disabled = false;
            document.getElementById('btnSolicitar').innerHTML = "Solicitar";
            return mostrarMensaje("Verifiar todos los datos")
        }

        const centroCosteSelect = document.getElementById('centroCoste');
        const selectedIndex = centroCosteSelect.selectedIndex;
        const selectedOption = centroCosteSelect.options[selectedIndex];
        const selectedText = selectedOption.text;

        let empresaPertece="";
        if (selectedText.substring(0, 4) == 'MFIM') {
            empresaPertece = 'Moras Finas';
        } else if (selectedText.substring(0, 4) == 'BCEM') {
            empresaPertece = 'Bayas del Centro';
        } else if (selectedText.substring(0, 4) == 'BIOJ') {
            empresaPertece = 'Bioagricultura';
        }

        const formData = new FormData();
        formData.append('id_usuario', idUSuario);
        formData.append('nombre_usuario', nombreUsuario);
        formData.append('rancho', rancho);
        formData.append('centro_coste',selectedText);
        formData.append('variedad', variedad);
        formData.append('folio', folio);
        formData.append('temporada', temporada);
        formData.append('cantidad', cantidad);
        formData.append('presentacion', prensetacion);
        formData.append('metodo_aplicacion', metodoAplicacion);
        formData.append('descripcion', descripcion);
        formData.append('empresa_pertece', empresaPertece);
        formData.append('image', imagen);
        try {
            //mandamos formadata
            const response = await fetchSolicitud(formData)
            console.log(response)
            mostrarMensaje("Solicitud enviada con éxito", 'success');
            lipiarCampos();
            document.getElementById('btnSolicitar').disabled = false;
            document.getElementById('btnSolicitar').innerHTML = "Solicitar";

        } catch (error) {
            console.log(error.message);
            mostrarMensaje(error.message);
            document.getElementById('btnSolicitar').disabled = false;
            document.getElementById('btnSolicitar').innerHTML = "Solicitar";
        }

    });
}
//hacemos peticion fecht
async function fetchSolicitud(formData) {
    const options = {
        method: "POST",
        body: formData
    };
    const response = await fetch(`/solicitud`, options);
    const data = await response.json();
    return data
}

//creamos funcion para limpiar campos der formulario de mezclas
const lipiarCampos = () => {
    document.getElementById('rancho').value = "";
    document.getElementById('centroCoste').value = "";
    document.getElementById('variedad').value = "";
    document.getElementById('folio').value = "";
    document.getElementById('temporada').value = "";
    document.getElementById('cantidad').value = "";
    document.getElementById('presentacion').value = "";
    document.getElementById('metodoAplicacion').value = "";
    document.getElementById('descripcion').value = "";
    document.getElementById('fileInput').value = "";
    document.getElementById('imageFile').value = "";
    //ocultamos los cannvas 
    document.getElementById('fileImage').style.display = "none";
    document.getElementById('InputImage').style.display = "none";
    continuarVideos()
}
