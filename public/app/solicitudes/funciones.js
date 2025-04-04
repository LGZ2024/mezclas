/* eslint-disable no-undef */
import { iniciarRegistros, verRegistro } from './solicitudes.js'
import { descargarReporte, descargarReporteV2 } from './reporte.js'
import { mostrarNotificaciones } from './notificaiones.js'
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('descargarReporte').addEventListener('click', descargarReporte)
  document.getElementById('descargarReporteV2').addEventListener('click', descargarReporteV2)
  iniciarRegistros()
  verRegistro()
  mostrarNotificaciones()
  // actuliza cada 5 minutos
  // setInterval(() => {
  //   window.location.reload()
  // }
  // , 300000)
})
