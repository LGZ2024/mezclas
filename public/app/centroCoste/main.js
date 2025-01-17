/* eslint-disable no-undef */
// Importar dependencias
import { iniciarRegistros, verRegistro } from './tablaViviendas.js'

// Eventos
$(document).ready(async () => {
  // Inicializar los registros de la tabla de VIFVIENDAS
  iniciarRegistros()
  // Mostrar los registros de la tabla de usuarios
  await verRegistro()
})
