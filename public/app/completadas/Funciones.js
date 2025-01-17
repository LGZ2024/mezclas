/* eslint-disable no-undef */
import { iniciarSolicitudes, verSolicitud } from './completadas.js'
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('regresar').addEventListener('click', () => {
    window.location.href = '/protected/admin'
  })
  iniciarSolicitudes()
  verSolicitud()
})
