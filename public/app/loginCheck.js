import { solicitarMescla, regresarF, tbSolicitada, regresarO, tbPreparacion, regresarP, ranchoDestino, centroCoste, abrirTomarFoto, abrirfileFoto, CargarImagen, tbEntregada, regresarTP } from "./FuncionesSolicita.js"
import { solicitaMesclaAlmacen, regresarSA, preparadaMesclaAlmacen, regresarPA, entregadaMesclaAlmacen, regresarEA, regresarTbs, guardarMezcla, regresarCerrar, CerrarMezcla, CargarImagenC, abrirTomarFotoC, abrirfileFotoC } from "./FuncionesAlmacen.js"
import { solicitaMesclaVisualizador, preparadaMesclaVisualizador, entregadaMesclaVisualizador, regresarV, regresarVP, regresarVPE } from "./FuncionesVisualizador.js"
import { solicitaMesclaGeneral, preparadaMesclaGeneral, entregadaMesclaGeneral, regresarG, regresarGP, regresarGPE } from "./FuncionesGeneral.js"
import { solicitarMesclaVS, solicitadasVS, preparadasVS, entregadasVS, regresarVS1, regresarVS2, regresarVS3, regresarVS4 } from "./FuncionesSolicitaVisualiza.js"
import { camara } from "./camara.js"
import './cerrarSesion.js';




/* aqui podremos autentificar y hacer diferentes acciones a las paginas  */
export const loginCheck = async (data) => {
    const body = document.querySelector('body');
    const elements = document.querySelectorAll('.barra__link');
    //esto no ayuda a definir el fondo
    if (screen.width < 767) {
        body.style.backgroundImage = 'url(../img/moras.jpg)';
        body.style.backgroundPosition = 'center';
        body.style.backgroundSize = 'cover';
        body.style.backgroundAttachment = 'fixed';
        elements.forEach(element => {
            element.style.color = '#000';
            element.style.fontWeight = 'bold'; // Agrega formato de negrita
        });

    } else {
        if (screen.width > 767) {
            body.style.backgroundImage = 'url(../img/paisaje.jpg)';
            body.style.backgroundPosition = 'center';
            body.style.backgroundSize = 'cover';
            body.style.backgroundAttachment = 'fixed';
        }
    }
    checkTipoUser(data)
}

const checkTipoUser = (data) => {
    console.log(data)
    const idUSuario = data.idUser
    const nombreUsuario = data.usuario;
    const empresaPertece = data.empresa;
    const tipoDeUsuario = data.tipoUser;
    // cargamos nombre en la pagina principal
    document.getElementById('inicio').innerHTML = nombreUsuario

    if (tipoDeUsuario == "solicita") {
        //ocultamos la seccion de mezclador y mostramos la seccion de solicitud
        document.getElementById('opciones').style.display = "block";
        //aqui selecionamos la lista de ranchos que corresponde a cada empresa
        const rancho = document.getElementById('rancho');
        rancho.innerHTML = '';
        if (empresaPertece == "Bayas del Centro") {
            rancho.append(new Option('Selecciona Centro de Coste', 0));
            rancho.append(new Option('La Loma', 'La Loma'));
            rancho.append(new Option('Ojo de Agua', 'Ojo de Agua'));
            rancho.append(new Option('Zapote', 'Zapote'));
        } else if (empresaPertece == "Moras Finas") {
            // realizamos filtro por usuario
            if (idUSuario === 9) {
                rancho.append(new Option('Selecciona Centro de Coste', 0));
                rancho.append(new Option('Potrero', 'Potrero'));
                rancho.append(new Option('Romero', 'Romero'));
            } else {
                rancho.append(new Option('Selecciona Centro de Coste', 0));
                rancho.append(new Option('Potrero', 'Potrero'));
                rancho.append(new Option('Casas de Altos', 'Casas de Altos'));
                rancho.append(new Option('Romero', 'Romero'));
            }

        } else if (empresaPertece == "Bioagricultura") {
            rancho.append(new Option('Selecciona Centro de Coste', 0));
            rancho.append(new Option('Ahualulco', 'Ahualulco'));
            rancho.append(new Option('Atemajac', 'Atemajac'));
        } else {
            rancho.append(new Option('Error al cargar los datos', 0));
        }
        /* camara() */
        ranchoDestino()
        centroCoste()
        /*funciones globales*/
        solicitarMescla(idUSuario, nombreUsuario)
        regresarF()
        tbSolicitada(idUSuario)
        regresarO()
        tbPreparacion(idUSuario)
        regresarP()
        tbEntregada(idUSuario)
        regresarTP()
        abrirTomarFoto()
        abrirfileFoto()
        CargarImagen()

    } else if (tipoDeUsuario == "solicita2") { //este tipo de usuario puede realizar solicitudes de mezcla a  mora finas y ballas del centro
        //ocultamos la seccion de mezclador y mostramos la seccion de solicitud
        document.getElementById('opciones').style.display = "block";
        //aqui selecionamos la lista de ranchos que corresponde a cada empresa
        const rancho = document.getElementById('rancho');
        rancho.innerHTML = '';
        rancho.append(new Option('Selecciona Centro de Coste', 0));
        rancho.append(new Option('La Loma', 'La Loma'));
        rancho.append(new Option('Ojo de Agua', 'Ojo de Agua'));
        rancho.append(new Option('Zapote', 'Zapote'));
        rancho.append(new Option('Casas de Altos', 'Casas de Altos'));
        rancho.append(new Option('Romero', 'Romero'));
        /* camara() */
        ranchoDestino()
        centroCoste()
        /*funciones globales*/
        solicitarMescla(idUSuario, nombreUsuario)
        regresarF()
        tbSolicitada(idUSuario)
        regresarO()
        tbPreparacion(idUSuario)
        regresarP()
        tbEntregada(idUSuario)
        regresarTP()
        abrirTomarFoto()
        abrirfileFoto()
        CargarImagen()
    } else if (tipoDeUsuario == "mezclador") {
        document.getElementById('opciones-almacen').style.display = "block";
        /* camaraC() */
        /* FUNCIONES GLOBALES */
        solicitaMesclaAlmacen(empresaPertece)
        regresarSA()
        preparadaMesclaAlmacen(empresaPertece)
        regresarPA()
        entregadaMesclaAlmacen(empresaPertece)
        regresarEA()
        guardarMezcla(idUSuario, empresaPertece)
        regresarTbs()
        CerrarMezcla(empresaPertece)
        regresarCerrar(empresaPertece)
        CargarImagenC()
        abrirTomarFotoC()
        abrirfileFotoC()
    } else if (tipoDeUsuario == "visualizador") {
        document.getElementById('opciones-visual').style.display = "block";
        solicitaMesclaVisualizador(empresaPertece)
        regresarV()
        preparadaMesclaVisualizador(empresaPertece)
        regresarVP()
        entregadaMesclaVisualizador(empresaPertece)
        regresarVPE()
    } else if (tipoDeUsuario == "solicitaVisual") {
        document.getElementById('opciones-visual-solicita').style.display = "block";
        //aqui selecionamos la lista de ranchos que corresponde a cada empresa para las solicitudes
        const rancho = document.getElementById('rancho');
        rancho.innerHTML = '';
        if (empresaPertece == "Bayas del Centro") {
            rancho.append(new Option('Selecciona Centro de Coste', 0));
            rancho.append(new Option('La Loma', 'La Loma'));
            rancho.append(new Option('Ojo de Agua', 'Ojo de Agua'));
            rancho.append(new Option('Zapote', 'Zapote'));
        } else if (empresaPertece == "Moras Finas") {
            rancho.append(new Option('Selecciona Centro de Coste', 0));
            rancho.append(new Option('Potrero', 'Potrero'));
            rancho.append(new Option('Casas de Altos', 'Casas de Altos'));
            rancho.append(new Option('Romero', 'Romero'));
        } else if (empresaPertece == "Bioagricultura") {
            rancho.append(new Option('Selecciona Centro de Coste', 0));
            rancho.append(new Option('Ahualulco', 'Ahualulco'));
            rancho.append(new Option('Atemajac', 'Atemajac'));
        } else {
            rancho.append(new Option('Error al cargar los datos', 0));
        }
        /* camara() */
        /* funciones globales */
        solicitarMesclaVS(idUSuario, nombreUsuario)
        solicitadasVS()
        preparadasVS()
        entregadasVS()
        ranchoDestino()
        centroCoste()
        regresarVS1()
        regresarVS2()
        regresarVS3()
        regresarVS4()
        abrirTomarFoto()
        abrirfileFoto()
        CargarImagen()
        camara()
    } else if (tipoDeUsuario == "general") {
        document.getElementById('opciones-visual').style.display = "block";
        solicitaMesclaGeneral()
        regresarG()
        preparadaMesclaGeneral()
        regresarGP()
        entregadaMesclaGeneral()
        regresarGPE()
    }

}