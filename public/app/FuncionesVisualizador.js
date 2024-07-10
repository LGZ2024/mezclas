import {iniciarMesclasV,verMesclazV,iniciarMesclasVP,verMesclazVP,iniciarMesclasVPE,verMesclazVPE} from "./tablaMesclaVisulizador.js"

function solicitaMesclaVisualizador(empresaPertece) {
    const solicita = document.getElementById('btnTablaSolicidataV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        iniciarMesclasV(empresaPertece,'solicitada')
        verMesclazV()
    });
}
function preparadaMesclaVisualizador(empresaPertece) {
    const solicita = document.getElementById('btnTablaPreparadasV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        iniciarMesclasVP(empresaPertece,'preparacion')
        verMesclazVP()
    });
}
function entregadaMesclaVisualizador(empresaPertece) {
    const solicita = document.getElementById('btnTablaEntragadasV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tabladeMezclaEntredas').style.display = "block";
        iniciarMesclasVPE(empresaPertece,'entregada')
        verMesclazVPE()
    });
}

function regresarV() {
    const regresar = document.getElementById('regresarO');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
            document.getElementById('tablaMesclaSolicitada').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}
function regresarVP() {
    const regresar = document.getElementById('regresarP');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
            document.getElementById('tabladeMezclaPreparacion').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}
function regresarVPE() {
    const regresar = document.getElementById('regresarS');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
            document.getElementById('tabladeMezclaEntredas').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}

export {solicitaMesclaVisualizador, preparadaMesclaVisualizador, entregadaMesclaVisualizador,regresarV,regresarVP,regresarVPE}