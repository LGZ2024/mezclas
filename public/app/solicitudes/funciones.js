/* eslint-disable no-undef */
import { iniciarRegistros, verRegistro } from './solicitudes.js'
import { descargarExcel, descargarReporte, descargarReporteV2 } from './reporte.js'
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('descargar').addEventListener('click', descargarExcel)
  document.getElementById('descargarReporte').addEventListener('click', descargarReporte)
  document.getElementById('descargarReporteV2').addEventListener('click', descargarReporteV2)
  iniciarRegistros()
  verRegistro()
})
