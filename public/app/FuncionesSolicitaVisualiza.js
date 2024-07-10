import { Solicitud } from "./solicitarMescla.js";
import {iniciarMesclasVS,verMesclazVS,iniciarMesclasVPS,verMesclazVPS,iniciarMesclasVPES,verMesclazVPES} from "./tablaMesclaVisulizadorSolicita.js";

//abrimos formulario para realizar solicitudes
function solicitarMesclaVS(idUSuario,nombreUsuario) {
    const solicita = document.getElementById('solicitarM');
    solicita.addEventListener('click', async () => {
        document.getElementById('opciones-visual-solicita').style.display = "none";
        document.getElementById('SecMesclaz').style.display = "block";
    });
    Solicitud(idUSuario,nombreUsuario)
}



/* mostrar tabla de solicitudes en proceso */
function solicitadasVS() {
    const buscar = document.getElementById('solicitudesM');
    buscar.addEventListener('click', () => {
        //ocultamos y mostramos la tabla de mezclas
        document.getElementById('opciones-visual-solicita').style.display = "none";
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
        }
        iniciarMesclasVS('solicitada')
        verMesclazVS()
    });
}
/* mostar tabla de solicitudes preparadas */
function preparadasVS(){
    const preparadas = document.getElementById('preparadasM');
    preparadas.addEventListener('click', () => {
        document.getElementById('opciones-visual-solicita').style.display = "none";
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
        }
        iniciarMesclasVPS('preparacion')
        verMesclazVPS()
    });
}
/* mostar tabla de solicitudes preparadas */
function entregadasVS(){
    const preparadas = document.getElementById('EntregadasM');
    preparadas.addEventListener('click', () => {
        document.getElementById('opciones-visual-solicita').style.display = "none";
        document.getElementById('tabladeMezclaEntredas').style.display = "block";
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
        }
        iniciarMesclasVPES('entregada')
        verMesclazVPES()
    });
}



/* cerrar formulario de solicitudes*/
function regresarVS1() {
    const regresar = document.getElementById('regresarf');
    regresar.addEventListener('click', () => {
        document.getElementById('SecMesclaz').style.display = "none";
        document.getElementById('opciones-visual-solicita').style.display = "block";
    });
}

/*cerrar tabla de solicitudes*/
function regresarVS2() {
    const regresar1 = document.getElementById('regresarO');
    regresar1.addEventListener('click', () => {
        document.getElementById('opciones-visual-solicita').style.display = "block";
        document.getElementById('tablaMesclaSolicitada').style.display = "none";
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
        }
    });
}
/* cerrar tabla de preparacion */
function regresarVS3(){
    const regresar = document.getElementById('regresarP');
    regresar.addEventListener('click', () => {
        document.getElementById('opciones-visual-solicita').style.display = "block";
        document.getElementById('tabladeMezclaPreparacion').style.display = "none";
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
        }
    });
}
/*cerrar tabla de preparadas */
function regresarVS4(){
    const regresar2 = document.getElementById('regresarS');
    regresar2.addEventListener('click', () => {
        document.getElementById('opciones-visual-solicita').style.display = "block";
        document.getElementById('tabladeMezclaEntredas').style.display = "none";
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
        }
    });
}

export {solicitarMesclaVS,solicitadasVS,preparadasVS,entregadasVS,regresarVS1,regresarVS2,regresarVS3,regresarVS4}