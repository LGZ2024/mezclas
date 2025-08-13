/* eslint-disable no-undef */
// Importar dependencias
import { iniciarRegistros, verRegistro } from '../usuarios/tablaUsuarios.js'
import FormularioUsuario from './funcionesFormulario.js'

// Verificar que jQuery esté disponible
if (typeof jQuery === 'undefined') {
  console.error('jQuery no está cargado')
} else {
  // Inicializar la aplicación cuando el documento esté listo
  $(document).ready(async () => {
    try {
      const formularioUsuario = new FormularioUsuario()

      // Inicializar métodos de la clase FormularioUsuario
      formularioUsuario.mostrarContraseña()
      formularioUsuario.mostrarContraseñaR()
      formularioUsuario.agregarNuevoRancho()
      formularioUsuario.agregarNuevoVariedad()
      // formularioUsuario.manejarCambioCentroCoste()

      // Iniciar tabla y sus funciones
      iniciarRegistros()
      await verRegistro()

      // Este submit controla el envío de la información de los nuevos usuarios
      document.getElementById('formEditar').addEventListener('submit', (e) => formularioUsuario.manejarEnvioReceta(e))
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error)
      console.error('Stack trace:', error.stack)
    }
  })
}
