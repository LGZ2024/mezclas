/* eslint-disable no-undef */
import { charUsuarioTotalGasto } from './graficas.js'
$(document).ready(async () => {
  const usuario = document.getElementById('usuario')
  const temporada = document.getElementById('temporada')
  const empresa = document.getElementById('empresa')
  const centroCoste = document.getElementById('centroCoste')
  const rancho = document.getElementById('rancho')
  const variedad = document.getElementById('variedad')

  usuario.addEventListener('click', () => {
    charUsuarioTotalGasto('usuario')
  })
  temporada.addEventListener('click', () => {
    charUsuarioTotalGasto('temporada')
  })
  empresa.addEventListener('click', () => {
    charUsuarioTotalGasto('empresa')
  })
  centroCoste.addEventListener('click', () => {
    charUsuarioTotalGasto('centroCoste')
  })
  rancho.addEventListener('click', () => {
    charUsuarioTotalGasto('rancho')
  })
  variedad.addEventListener('click', () => {
    charUsuarioTotalGasto('variedad')
  })
})
