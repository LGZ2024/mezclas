import {iniciarMesclasV,verMesclazV,iniciarMesclasVP,verMesclazVP,iniciarMesclasVPE,verMesclazVPE} from "./tablaMesclaGeneral.js"

function solicitaMesclaGeneral(empresaPertece) {
    const solicita = document.getElementById('btnTablaSolicidataV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tablaMesclaSolicitada').style.display = "block";
        iniciarMesclasV('solicitada')
        verMesclazV()
    });
}
function preparadaMesclaGeneral(empresaPertece) {
    const solicita = document.getElementById('btnTablaPreparadasV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tabladeMezclaPreparacion').style.display = "block";
        iniciarMesclasVP('preparacion')
        verMesclazVP()
    });
}
function entregadaMesclaGeneral(empresaPertece) {
    const solicita = document.getElementById('btnTablaEntragadasV');
    solicita.addEventListener('click', () => {
        document.getElementById('opciones-visual').style.display = "none";
        document.getElementById('tabladeMezclaEntredas').style.display = "block";
        iniciarMesclasVPE('entregada')
        verMesclazVPE()
    });
}

function regresarG() {
    const regresar = document.getElementById('regresarO');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
            $('#tbSolicitadas').DataTable().destroy();
            document.getElementById('tablaMesclaSolicitada').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}
function regresarGP() {
    const regresar = document.getElementById('regresarP');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbPreparadas')) {
            $('#tbPreparadas').DataTable().destroy();
            document.getElementById('tabladeMezclaPreparacion').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}
function regresarGPE() {
    const regresar = document.getElementById('regresarS');
    regresar.addEventListener('click', () => {
        if ($.fn.DataTable.isDataTable('#tbCerradas')) {
            $('#tbCerradas').DataTable().destroy();
            document.getElementById('tabladeMezclaEntredas').style.display = "none";
            document.getElementById('opciones-visual').style.display = "block";
        }
    });
}

export {solicitaMesclaGeneral, preparadaMesclaGeneral, entregadaMesclaGeneral,regresarG,regresarGP,regresarGPE}