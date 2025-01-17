/* eslint-disable no-undef */
// Importar dependencias
import { iniciarRegistros, verRegistro } from '../usuarios/tablaUsuarios.js'
import { manejarEnvioReceta, agregarNuevoRancho, manejarCambioCentroCoste, mostrarContraseña, mostrarContraseñaR } from './funcionesFormulario.js'
// import { listaViviendas } from '../admin/postList.js'

// Verificar que jQuery esté disponible
if (typeof jQuery === 'undefined') {
  console.error('jQuery no está cargado')
} else {
  // Inicializar la aplicación cuando el documento esté listo
  $(document).ready(async () => {
    try {
      // iniciamos tabla y sus funciones
      iniciarRegistros()
      await verRegistro()
      // este submit controla el envio de la informacion de los nuevos usuarios
      document.getElementById('formEditar').addEventListener('submit', manejarEnvioReceta)
      agregarNuevoRancho()
      manejarCambioCentroCoste()
      mostrarContraseña()
      mostrarContraseñaR()
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error)
      console.error('Stack trace:', error.stack)
    }
  })
}
