/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { SolicitudFormulario } from '../solicitud/cerrarMezcla.js'
import { iniciarProceso, verProceso } from './proceso.js'
document.addEventListener('DOMContentLoaded', () => {
  $(document).on('click', '#regresar', () => {
    window.location.href = '/protected/admin'
  })

  $(document).on('click', '#regresatabla', () => {
    document.getElementById('tablaFuciones').style.display = 'block'
    document.getElementById('formPreparadas').style.display = 'none'
  })
  $(document).on('click', '#regresarCerrar', () => {
    document.getElementById('formCerrar').style.display = 'none'
    document.getElementById('formPreparadas').style.display = 'block'
  })

  document.getElementById('receta').addEventListener('click', async () => {
    const idSolicitud = document.getElementById('idSolicitud').value
    $('#staticBackdrop').modal('show')
    // iniciamos tabla
    iniciarProductosReceta(idSolicitud)
    // iniciamos rol
    await verProductosReceta({
      eliminarUltimaColumna: true,
      columnaAEliminar: -1, // Última columna
      depuracion: true
    })
  })

  $(document).on('click', '#btnCerrarMescla', () => {
    document.getElementById('formCerrar').style.display = 'block'
    document.getElementById('formPreparadas').style.display = 'none'
    document.getElementById('idMesclas').value = document.getElementById('folioi').value
    document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())
  })
  iniciarProceso()
  verProceso()
})
