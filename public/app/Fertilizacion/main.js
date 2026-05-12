/* eslint-disable no-undef */
import { mostrarMensaje, MensajeEliminacion } from '../funciones.js'
import { showSpinner, hideSpinner } from '../spinner.js'

// Función para capitalizar la primera letra de cada palabra
const capitalizarPalabras = (str) => {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
  let ingredientesTemporales = []
  let idMezclaActual = null
  let submitButton = null
  // Función para aplicar capitalización a un formulario
  const aplicarCapitalizacion = (form) => {
    if (!form) return
    const inputsTexto = form.querySelectorAll('input[type="text"]')
    inputsTexto.forEach(input => {
      input.addEventListener('input', (e) => {
        const valor = e.target.value
        if (valor !== valor.toUpperCase()) { // No capitalizar si está en mayúsculas
          requestAnimationFrame(() => {
            e.target.value = capitalizarPalabras(valor)
          })
        }
      })
    })
  }
  // cachear referencia DOM
  const elementos = {
    // Botones
    BtnRegresar: document.getElementById('regresar'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    btnNuevaMezcla: document.getElementById('btnNuevaMezcla'),
    // formularios
    formMezcla: document.getElementById('formMezcla'),
    btnAgregarIngrediente: document.getElementById('btnAgregarIngrediente'),
    formTanque: document.getElementById('formTanque'),
    formAplicacion: document.getElementById('formPaso3'),
    // modales
    modalMezcla: document.getElementById('modalMezcla'),
    // otros elementos
    cantidadInput: document.getElementById('cantidad_activo')
  }

  // Función para actualizar UI de forma optimizada y segura
  const actualizarUI = (callback) => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(async () => {
        try {
          const resultado = await callback() // 🟢 ahora sí lo esperas
          resolve(resultado) // 🟢 y lo devuelves
        } catch (error) {
          console.error('Error en UI update:', error)
          if (typeof mostrarError === 'function') {
            mostrarError('Error al actualizar la interfaz')
          }
          resolve(null) // Resolver para no romper cadenas de promesas
        }
      })
    })
  }

  // funcion para llenar los selects
  const setPostSelect = (data, selectId, property) => {
    actualizarUI(() => {
      ejecutarSeguros(() => {
        const select = document.getElementById(selectId)
        if (!select) return // Validación extra
        select.innerHTML = ''
        if (data && data.length) { // Validación extra de data
          select.append(new Option('Selecciona una opción', ''))
          data.forEach(doc => {
            select.append(new Option(doc[property], doc.id))
          })
        } else {
          select.append(new Option('Error al cargar los datos', 0))
        }
      })
    })
  }
  // Helper para obtener el botón submit con fallbacks seguros.
  const obtenerSubmitBtn = (e, fallbackId = null) => {
    try {
      if (e && e.submitter) return e.submitter
    } catch (err) {
      // some browsers may throw, sigue con fallbacks
    }
    if (e && e.target && typeof e.target.querySelector === 'function') {
      const btnDentro = e.target.querySelector('button[type="submit"]')
      if (btnDentro) return btnDentro
    }
    if (fallbackId) {
      const byId = document.getElementById(fallbackId)
      if (byId) return byId
    }
    return elementos.btnRegistrar || null
  }

  // Validad Campos
  const validarFormulario = async (camposRequeridos) => {
    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      // Si el elemento no existe, considerarlo inválido para forzar el mensaje
      if (!elemento) return true
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      await actualizarUI(() => {
        mostrarError(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`)
        // Reactivar botón global de registro si existe
        if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        hideSpinner()
      })
      return false
    }

    return true
  }

  // Métodos de respuesta
  const mostrarError = (mensaje) => {
    mostrarMensaje(
      mensaje,
      'error'
    )
  }
  const mostrarExito = async (mensaje, redirectUrl) => {
    mostrarMensaje(
      mensaje,
      'success'
    )
    return true
  }
  // resolver respuestas fetch y mostrar mensajes
  const fetchApi = async (url, method = 'GET', data) => {
    try {
      const options = { method: method.toUpperCase(), headers: {} }
      // Agregar body y header sólo para métodos distintos a GET
      if (options.method !== 'GET') {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)
      return response
    } catch (error) {
      console.error('Error en fetchApi:', error)
      mostrarError(error.message || error)
      // Re-lanzar para que el caller lo maneje
      throw error
    }
  }

  // funcion para ejecutar callbacks con manejo de errores
  const ejecutarSeguros = (callback) => {
    try {
      callback()
    } catch (error) {
      mostrarError(error)
    }
  }
  // Función para inicializar un formulario con eventos
  const inicializarFormulario = (form, submitHandler) => {
    if (form) {
      form.addEventListener('submit', submitHandler)
      aplicarCapitalizacion(form)
    }
  }

  // delegacion de eventos
  const handlers = {
    handleRegresar() {
      actualizarUI(() => {
        window.history.back()
      })
    },

    // ========== GESTIÓN DE MEZCLAS ==========
    async handleCrearMezcla(e) {
      e.preventDefault()
      showSpinner()

      submitButton = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitButton) submitButton.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      // Determinar si es creación o edición (una sola vez)
      const esEdicion = idMezclaActual !== null && idMezclaActual !== undefined

      // Recopilar datos del formulario
      const formData = {
        nombre: document.getElementById('nombre_mezcla')?.value,
        fabricante: document.getElementById('fabricante_mezcla')?.value,
        descripcion: document.getElementById('descripcion_mezcla')?.value,
        volumen_tanque: document.getElementById('volumen_tanque')?.value
      }

      const camposRequeridos = ['nombre_mezcla', 'fabricante_mezcla', 'volumen_tanque']
      if (!(await validarFormulario(camposRequeridos))) return

      try {
        // Endpoint dinámico según si es edición o creación
        const metodo = esEdicion ? 'PUT' : 'POST'
        const endpoint = esEdicion
          ? `/api/fertilizacion/mezclas/${idMezclaActual}`
          : '/api/fertilizacion/mezclas'

        // Guardar mezcla
        const respuesta = await fetchApi(endpoint, metodo, formData)
        const dataResp = await respuesta.json()

        if (!respuesta.ok || !dataResp.success) {
          mostrarError(dataResp.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} mezcla`)
          hideSpinner()
          if (submitButton) submitButton.disabled = false
          return
        }

        // Obtener ID: si es edición usa el actual, si es creación usa el retornado
        const idMezcla = esEdicion ? idMezclaActual : dataResp.data.id

        // Guardar ingredientes (aplica para creación Y edición)
        if (ingredientesTemporales.length > 0) {
          const ingredientesPayload = ingredientesTemporales.map(ing => ({
            id_activo: ing.id,
            cantidad: ing.cantidad,
            unidad: ing.unidad
          }))

          // PUT siempre reemplaza (funciona para ambos casos)
          const respuestaIng = await fetchApi(
            `/api/fertilizacion/mezclas/${idMezcla}/ingredientes`,
            'PUT',
            { activos: ingredientesPayload }
          )
          const dataIng = await respuestaIng.json()

          if (!respuestaIng.ok || !dataIng.success) {
            // Advertencia: mezcla guardada pero ingredientes no actualizados
          }
        }

        // Mostrar éxito y limpiar
        const mensajeExito = esEdicion ? 'Mezcla actualizada correctamente' : 'Mezcla creada correctamente'
        mostrarExito(mensajeExito, null)
        hideSpinner()

        if (e.target) e.target.reset()
        // eslint-disable-next-line no-undef
        $('#modalMezcla').modal('hide')

        // Recargar y renderizar lista
        await window.cargarMezclas()

        // Reset variables
        ingredientesTemporales = []
        idMezclaActual = null

        if (submitButton) submitButton.disabled = false
      } catch (error) {
        mostrarError('Error al guardar mezcla: ' + error.message)
        hideSpinner()
        if (submitButton) submitButton.disabled = false
      }
    },

    async handleAgregarIngredientes(idMezcla) {
      // Función auxiliar para agregar ingredientes a una mezcla
      if (ingredientesTemporales.length === 0) {
        return { success: true, message: 'Sin ingredientes para agregar' }
      }

      try {
        const payloadActivos = ingredientesTemporales.map(ing => ({
          id_activo: ing.id,
          cantidad: ing.cantidad,
          unidad: ing.unidad
        }))

        const respuesta = await fetchApi(
          `/api/fertilizacion/mezclas/${idMezcla}/ingredientes`,
          'POST',
          { activos: payloadActivos }
        )
        const data = await respuesta.json()
        return { success: data.success, message: data.message }
      } catch (error) {
        console.error('Error al agregar ingredientes:', error)
        return { success: false, message: error.message }
      }
    },

    async handleActualizarIngredientes(idMezcla) {
      // Función auxiliar para actualizar ingredientes (usado en edición)
      if (ingredientesTemporales.length === 0) {
        return { success: true, message: 'Sin ingredientes' }
      }

      try {
        const payloadActivos = ingredientesTemporales.map(ing => ({
          id_activo: ing.id,
          cantidad: ing.cantidad,
          unidad: ing.unidad
        }))

        const respuesta = await fetchApi(
          `/api/fertilizacion/mezclas/${idMezcla}/ingredientes`,
          'PUT',
          { activos: payloadActivos }
        )
        const data = await respuesta.json()
        return { success: data.success, message: data.message }
      } catch (error) {
        console.error('Error al actualizar ingredientes:', error)
        return { success: false, message: error.message }
      }
    },

    async handleEditarMezcla(id) {
      try {
        idMezclaActual = id
        const respuesta = await fetchApi(`/api/fertilizacion/mezclas/${id}`, 'GET')
        const data = await respuesta.json()

        if (data.success) {
          const mezcla = data.data
          document.getElementById('id_mezcla_edit').value = id
          document.getElementById('nombre_mezcla').value = mezcla.nombre || ''
          document.getElementById('fabricante_mezcla').value = mezcla.fabricante || ''
          document.getElementById('descripcion_mezcla').value = mezcla.descripcion || ''
          document.getElementById('volumen_tanque').value = mezcla.volumen_tanque || 1000

          // Cargar ingredientes existentes
          ingredientesTemporales = []
          if (mezcla.MezclaActivos && mezcla.MezclaActivos.length > 0) {
            ingredientesTemporales = mezcla.MezclaActivos.map(ma => ({
              id: ma.id_activo,
              nombre: ma.ActivoMezcla?.nombre || 'Desconocido',
              cantidad: ma.cantidad,
              unidad: ma.unidad,
              tipo: ma.ActivoMezcla?.tipo || ''
            }))
          }
          handlers.renderizarIngredientes()

          // Cargar catálogos de activos si es necesario
          if (!document.getElementById('select_activo').children.length ||
            document.getElementById('select_activo').children.length === 1) {
            const catalogos = await handlers.handleCargarCatalogos()
            if (catalogos && catalogos.activos) {
              const select = document.getElementById('select_activo')
              select.innerHTML = '<option value="">-- Elige un ingrediente --</option>'
              catalogos.activos.forEach(activo => {
                const option = document.createElement('option')
                option.value = activo.id
                option.textContent = `${activo.nombre} (${activo.codigo}) - ${activo.tipo}`
                select.appendChild(option)
              })
            }
          }
        } else {
          mostrarError(data.message || 'Error al cargar mezcla')
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
      }
    },

    async handleObtenerActivosMezcla(id) {
      try {
        const respuesta = await fetchApi(`/api/fertilizacion/mezclas/${id}/ingredientes`, 'GET')
        const data = await respuesta.json()

        if (data.success && data.data) {
          // El controlador devuelve la mezcla completa, extraer solo MezclaActivos
          return data.data.MezclaActivos || []
        } else {
          mostrarError(data.message || 'Error al cargar ingredientes')
          return []
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
        return []
      }
    },

    async handleEliminarMezcla(id) {
      try {
        const url = `/api/fertilizacion/mezclas/${id}`
        const metodo = 'DELETE'
        const res = await MensajeEliminacion(url, metodo)

        if (res === true) {
          // Recargar mezclas
          await handlers.handleObtenerMezclas()
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
      }
    },

    async handleObtenerMezclas() {
      try {
        const respuesta = await fetchApi('/api/fertilizacion/catalogo/mezclas', 'GET')
        const data = await respuesta.json()

        if (data.success) {
          return data.data
        } else {
          mostrarError(data.message)
          return []
        }
      } catch (error) {
        console.error('Error:', error)
        mostrarError('Error al obtener mezclas: ' + error.message)
        return []
      }
    },

    handleAgregarIngrediente() {
      const selectActivo = document.getElementById('select_activo')
      const cantidadInput = document.getElementById('cantidad_activo')
      const unidadSelect = document.getElementById('unidad_activo')

      if (!selectActivo?.value || !cantidadInput?.value) {
        mostrarError('Por favor selecciona un ingrediente y cantidad')
        return
      }

      const activoSeleccionado = Array.from(selectActivo.options).find(
        opt => opt.value === selectActivo.value
      )

      if (!activoSeleccionado) {
        mostrarError('Activo no válido')
        return
      }

      const ingrediente = {
        id: selectActivo.value,
        nombre: activoSeleccionado.textContent.split('(')[0].trim(),
        cantidad: parseFloat(cantidadInput.value),
        unidad: unidadSelect?.value || 'KG',
        tipo: activoSeleccionado.textContent.split('-')[1]?.trim() || ''
      }

      // Evitar duplicados
      const existe = ingredientesTemporales.some(ing => ing.id === ingrediente.id)
      if (existe) {
        mostrarError('Este ingrediente ya fue agregado')
        return
      }

      ingredientesTemporales.push(ingrediente)
      handlers.renderizarIngredientes()

      // Limpiar inputs
      selectActivo.value = ''
      cantidadInput.value = ''
    },

    renderizarIngredientes() {
      const listaDiv = document.getElementById('listaIngredientes')

      if (ingredientesTemporales.length === 0) {
        listaDiv.innerHTML = '<p class="text-muted text-center mb-0"><i class="mdi mdi-information"></i> Sin ingredientes aún</p>'
        return
      }

      listaDiv.innerHTML = ingredientesTemporales.map((ing, idx) => {
        const tipoClase = `type-${ing.tipo?.toLowerCase() || 'otro'}`
        return `
          <div class="ingrediente-item">
            <div style="flex: 1;">
              <span class="macro-badge ${tipoClase}">${ing.nombre}</span>
              <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
                <label style="margin-bottom: 0; font-size: 12px; min-width: 60px;">Cantidad:</label>
                <input type="number" class="form-control form-control-sm" style="max-width: 80px;" 
                       value="${ing.cantidad}" step="0.01" min="0"
                       onchange="window.fertilizacionHandlers.handleActualizarCantidad(${idx}, this.value)">
                <span style="font-weight: bold;">${ing.unidad}</span>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.fertilizacionHandlers.handleEliminarIngrediente(${idx})">
              <i class="mdi mdi-trash-can"></i>
            </button>
          </div>
        `
      }).join('')
    },

    handleActualizarCantidad(index, cantidad) {
      if (index >= 0 && index < ingredientesTemporales.length) {
        ingredientesTemporales[index].cantidad = parseFloat(cantidad) || 0
      }
    },

    handleEliminarIngrediente(index) {
      if (index >= 0 && index < ingredientesTemporales.length) {
        ingredientesTemporales.splice(index, 1)
        handlers.renderizarIngredientes()
      }
    },

    // ========== PREPARACIÓN DE TANQUES ==========
    async handleCrearTanquePreparado(e) {
      e.preventDefault()
      showSpinner()

      // Soporte para IDs de ambas vistas (wizard y página individual)
      const idTanque = document.getElementById('id_tanque')?.value || document.getElementById('id_tanque_fisico')?.value
      const idMezcla = document.getElementById('id_mezcla')?.value || document.getElementById('id_mezcla_base')?.value
      const idRancho = document.getElementById('id_rancho')?.value || document.getElementById('id_rancho_prepa')?.value
      const fecha = document.getElementById('fecha_preparacion')?.value
      const litros = document.getElementById('litros_totales')?.value

      const formData = {
        id_tanque: idTanque,
        id_mezcla: idMezcla,
        fecha_preparacion: fecha,
        litros_totales: litros,
        id_rancho: idRancho
      }

      // Validar que tengamos datos (los IDs pueden variar, validamos los valores finales)
      if (!idTanque || !idMezcla || !fecha || !litros) {
        mostrarError('Por favor complete todos los campos requeridos')
        hideSpinner()
        return
      }

      try {
        const respuesta = await fetchApi('/api/fertilizacion/preparar-tanque', 'POST', formData)
        const data = await respuesta.json()

        if (respuesta.ok && data.success) {
          mostrarExito('Tanque preparado registrado', null)
          hideSpinner()
          if (e.target) e.target.reset()

          // Actualizar tabla si existe
          if (document.getElementById('tablaTanquesPreparados')) {
            handlers.handleObtenerTanquesPreparados()
          }

          return data.data
        } else {
          mostrarError(data.message || 'Error al preparar tanque')
          hideSpinner()
          return null
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
        hideSpinner()
      }
    },

    // ========== REGISTRO DE APLICACIONES ==========
    async handleRegistrarAplicacion(e) {
      e.preventDefault()
      showSpinner()

      const formData = {
        id_tanque_preparado: document.getElementById('id_tanque_preparado')?.value,
        id_sector: document.getElementById('id_sector')?.value,
        litros_aplicados: document.getElementById('litros_aplicados')?.value,
        fecha: document.getElementById('fecha_aplicacion')?.value,
        id_responsable: document.getElementById('id_responsable')?.value || 1
      }

      const camposRequeridos = ['id_tanque_preparado', 'id_sector', 'litros_aplicados', 'fecha_aplicacion']
      if (!(await validarFormulario(camposRequeridos))) return

      try {
        const respuesta = await fetchApi('/api/fertilizacion/aplicar', 'POST', formData)
        const data = await respuesta.json()

        if (respuesta.ok && data.success) {
          mostrarExito('Aplicación registrada correctamente', null)
          hideSpinner()
          if (e.target) e.target.reset()
          return data.data
        } else {
          mostrarError(data.message || 'Error al registrar aplicación')
          hideSpinner()
          return null
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
        hideSpinner()
      }
    },

    async handleAgregarActivosTanque(e) {
      e.preventDefault()
      showSpinner()

      const idMezcla = document.getElementById('id_mezcla')?.value
      const activos = [] // Esto debería poblar desde el formulario

      if (!idMezcla || activos.length === 0) {
        mostrarError('Selecciona mezcla e ingredientes')
        hideSpinner()
        return null
      }

      try {
        const respuesta = await fetchApi(
          `/api/fertilizacion/mezclas/${idMezcla}/ingredientes`,
          'POST',
          { activos }
        )
        const data = await respuesta.json()

        if (respuesta.ok && data.success) {
          mostrarExito('Ingredientes asignados', null)
          hideSpinner()
          return data.data
        } else {
          mostrarError(data.message || 'Error al asignar ingredientes')
          hideSpinner()
          return null
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
        hideSpinner()
        return null
      }
    },

    // ========== OBTENER CATÁLOGOS ==========
    async handleCargarCatalogos() {
      try {
        const respuesta = await fetchApi('/api/fertilizacion/catalogos', 'GET')
        const data = await respuesta.json()

        if (data.success) {
          return data.data
        } else {
          mostrarError('Error al cargar catálogos')
          return null
        }
      } catch (error) {
        mostrarError('Error: ' + error.message)
        return null
      }
    },

    // ========== TANQUES PREPARADOS (TABLA) ==========
    async handleObtenerTanquesPreparados() {
      try {
        const respuesta = await fetchApi('/api/fertilizacion/tanques-preparados', 'GET')
        const data = await respuesta.json()
        if (data.success) {
          handlers.renderizarTablaTanques(data.data)
        }
      } catch (error) {
        console.error('Error al cargar tanques preparados:', error)
      }
    },

    verTanquesPreparados() {
      if (!document.getElementById('tbTanquesPreparados')) return
      if ($.fn.DataTable.isDataTable('#tbTanquesPreparados')) {
        $('#tbTanquesPreparados').DataTable().destroy()
      }

      $('#tbTanquesPreparados').DataTable({
        paging: true,
        order: [[0, 'desc']],
        responsive: true,
        buttons: [
          {
            extend: 'copyHtml5',
            text: '<a class="mdi mdi-content-copy icon"></a>',
            titleAttr: 'Copiar'
          },
          {
            extend: 'excelHtml5',
            text: '<a class="mdi mdi-file-excel icon"></a>',
            titleAttr: 'Excel'
          },
          {
            extend: 'csvHtml5',
            text: '<a class="mdi mdi-file-excel-box icon"></a>',
            titleAttr: 'CSV'
          }
        ],
        dom: '<"d-flex justify-content-between m-4"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        language: {
          lengthMenu: 'Mostrar _MENU_ registros',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
          infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
          infoFiltered: '(filtrado de un total de _MAX_ registros)',
          sSearch: 'Buscar:',
          oPaginate: {
            sFirst: 'Primero',
            sLast: 'Último',
            sNext: 'Siguiente',
            sPrevious: 'Anterior'
          },
          sProcessing: 'Procesando...'
        },
        columnDefs: [
          { targets: 0, data: 'codigo' },
          { targets: 1, data: 'fecha' },
          { targets: 2, data: 'rancho' },
          { targets: 3, data: 'tanque' },
          { targets: 4, data: 'mezcla' },
          { targets: 5, data: 'disponible' },
          { targets: 6, data: 'acciones' }
        ]
      })
    },

    renderizarTablaTanques(tanques) {
      const tableEl = document.getElementById('tbTanquesPreparados')
      const tbody = document.getElementById('tablaTanquesPreparados')
      if (!tableEl || !tbody) return

      if (!$.fn.DataTable.isDataTable('#tbTanquesPreparados')) {
        handlers.verTanquesPreparados()
      }

      const table = $('#tbTanquesPreparados').DataTable()

      if (!tanques || tanques.length === 0) {
        table.clear().draw()
        return
      }
      const rows = tanques.map(t => {
        // Renderizar lista de mezclas
        let mezclasHtml = ''
        if (t.MezclasTanques && t.MezclasTanques.length > 0) {
          mezclasHtml = t.MezclasTanques.map(mt =>
            `<div class="mb-1"><span class="badge badge-light border"><i class="mdi mdi-flask-outline mr-1"></i><strong>${mt.MezclaCatalogo?.nombre}:</strong> ${mt.cantidad_litros}L</span></div>`
          ).join('')
        } else {
          mezclasHtml = t.MezclaCatalogo ? `<span class="badge badge-light border">${t.MezclaCatalogo.nombre}</span>` : '<span class="text-muted">N/A</span>'
        }

        return {
          codigo: t.codigo_tanque_preparado || 'N/A',
          fecha: t.fecha_preparacion,
          rancho: t.rancho?.rancho || 'N/A',
          tanque: t.Tanque?.codigo || 'N/A',
          mezcla: mezclasHtml,
          disponible: `<strong>${t.litros_disponibles}</strong> / ${t.litros_totales} L`,
          acciones: `
            <button type="button" class="btn btn-sm btn-outline-primary" onclick="verDetalleTanque(${t.id})">
               <i class="mdi mdi-eye"></i> Ver Detalle
            </button>
          `
        }
      })

      table.clear().rows.add(rows).draw()
    }
  }

  // Inicializar eventos

  if (elementos.BtnRegresar) {
    elementos.BtnRegresar.addEventListener('click', handlers.handleRegresar)
  }

  // ========== INICIALIZAR FORMULARIOS DE FERTILIZACIÓN ==========

  // Formulario de mezcla
  if (elementos.formMezcla) {
    inicializarFormulario(elementos.formMezcla, (e) => handlers.handleCrearMezcla(e))
  }

  // ========== EVENTOS PARA AGREGAR INGREDIENTES ==========
  if (elementos.btnAgregarIngrediente) {
    elementos.btnAgregarIngrediente.addEventListener('click', () => handlers.handleAgregarIngrediente())
  }

  // Permitir agregar ingrediente con Enter en el campo de cantidad
  if (elementos.cantidadInput) {
    elementos.cantidadInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handlers.handleAgregarIngrediente()
      }
    })
  }

  // Evento para cargar activos al abrir modal (respaldo)
  if (elementos.modalMezcla) {
    elementos.modalMezcla.addEventListener('shown.bs.modal', async () => {
      const select = document.getElementById('select_activo')

      // Si el select está vacío (solo tiene el placeholder), cargar catálogos
      if (!select || select.options.length <= 1) {
        const catalogos = await handlers.handleCargarCatalogos()
        if (catalogos && catalogos.activos) {
          select.innerHTML = '<option value="">-- Elige un ingrediente --</option>'
          catalogos.activos.forEach(activo => {
            const option = document.createElement('option')
            option.value = activo.id
            option.textContent = `${activo.nombre} (${activo.codigo}) - ${activo.tipo}`
            select.appendChild(option)
          })
        }
      } else {
        // Ya hay opciones, no hacer nada
      }
    })
  }

  // Evento para limpiar formulario al cerrar modal
  if (elementos.modalMezcla) {
    elementos.modalMezcla.addEventListener('hidden.bs.modal', () => {
      if (elementos.formMezcla) {
        elementos.formMezcla.reset()
        ingredientesTemporales = []
        idMezclaActual = null
        handlers.renderizarIngredientes()
        document.getElementById('id_mezcla_edit').value = ''
      }
    })
  }

  // Botón para nueva mezcla
  if (elementos.btnNuevaMezcla) {
    elementos.btnNuevaMezcla.addEventListener('click', async () => {
      // Resetear todo para crear nueva mezcla
      ingredientesTemporales = []
      idMezclaActual = null
      if (elementos.formMezcla) {
        elementos.formMezcla.reset()
        document.getElementById('id_mezcla_edit').value = ''
      }
      document.getElementById('modalMezclaTitle').textContent = 'Nueva Mezcla'
      handlers.renderizarIngredientes()

      // Cargar catálogos ANTES de abrir el modal
      const catalogos = await handlers.handleCargarCatalogos()
      if (catalogos && catalogos.activos) {
        const select = document.getElementById('select_activo')
        select.innerHTML = '<option value="">-- Elige un ingrediente --</option>'
        catalogos.activos.forEach(activo => {
          const option = document.createElement('option')
          option.value = activo.id
          option.textContent = `${activo.nombre} (${activo.codigo}) - ${activo.tipo}`
          select.appendChild(option)
        })
      } else {
        // No hay catálogos, no hacer nada
      }

      // Abrir modal
      // eslint-disable-next-line no-undef
      $('#modalMezcla').modal('show')
    })
  }

  // Formulario de preparar tanque
  if (elementos.formTanque) {
    elementos.formTanque.addEventListener('submit', (e) => handlers.handleCrearTanquePreparado(e))
  }

  // Formulario de registro de aplicación
  if (elementos.formAplicacion) {
    elementos.formAplicacion.addEventListener('submit', (e) => handlers.handleRegistrarAplicacion(e))
  }

  // Cargar catálogos al iniciar página de registro o preparar tanque
  if (window.location.pathname.includes('registro') || window.location.pathname.includes('preparar-tanque')) {
    handlers.handleCargarCatalogos().then(catalogos => {
      if (catalogos) {
        // Poblar selects (soportando ambos nombres de variables)
        if (catalogos.tanques) {
          setPostSelect(catalogos.tanques, 'id_tanque_fisico', 'codigo')
          setPostSelect(catalogos.tanques, 'id_tanque', 'codigo')
        }
        if (catalogos.mezclas) {
          setPostSelect(catalogos.mezclas, 'id_mezcla_base', 'nombre')
          setPostSelect(catalogos.mezclas, 'id_mezcla', 'nombre')
        }
        if (catalogos.sectores) {
          setPostSelect(catalogos.sectores, 'id_sector', 'sector_interno')
        }
        if (catalogos.ranchos) {
          setPostSelect(catalogos.ranchos, 'id_rancho_prepa', 'rancho')
          setPostSelect(catalogos.ranchos, 'id_rancho', 'rancho')
        }
      }
    })

    // Cargar tabla de tanques si estamos en preparar tanque
    if (window.location.pathname.includes('preparar-tanque')) {
      if (document.getElementById('tbTanquesPreparados')) {
        handlers.verTanquesPreparados()
      }
      handlers.handleObtenerTanquesPreparados()
    }
  }

  // Exportar handlers para uso en otros módulos
  window.fertilizacionHandlers = handlers

  // ========== FUNCIONES GLOBALES PARA VISTAS ==========
  // Funciones de mezclas (compatibilidad con mezclas.ejs)
  window.editarMezcla = (id) => {
    if (handlers.handleEditarMezcla) {
      handlers.handleEditarMezcla(id)
      // eslint-disable-next-line no-undef
      $('#modalMezcla').modal('show')
      document.getElementById('modalMezclaTitle').textContent = 'Editar Mezcla'
    }
  }

  window.verActivos = (id) => {
    const modal = document.getElementById('modalActivos')
    const listadoDiv = document.getElementById('listadoActivos')

    if (handlers.handleObtenerActivosMezcla) {
      handlers.handleObtenerActivosMezcla(id).then(activos => {
        if (activos && activos.length > 0) {
          const html = activos.map(ma => `
            <div class="ingrediente-item">
              <div>
                <strong>${ma.ActivoMezcla?.nombre || 'Desconocido'}</strong><br>
                <small class="text-muted">${ma.ActivoMezcla?.codigo || 'N/A'} (${ma.ActivoMezcla?.tipo || 'OTRO'})</small>
              </div>
              <div class="text-right">
                <span class="badge badge-primary">${ma.cantidad} ${ma.unidad}</span>
              </div>
            </div>
          `).join('')
          listadoDiv.innerHTML = html
        } else {
          listadoDiv.innerHTML = '<p class="alert alert-warning">Sin ingredientes</p>'
        }
        // eslint-disable-next-line no-undef
        $(modal).modal('show')
      }).catch(error => {
        console.error('Error al obtener activos:', error)
        listadoDiv.innerHTML = '<p class="alert alert-danger">Error al cargar ingredientes</p>'
        // eslint-disable-next-line no-undef
        $(modal).modal('show')
      })
    }
  }

  window.eliminarMezcla = (id) => {
    if (handlers.handleEliminarMezcla) {
      handlers.handleEliminarMezcla(id).then(() => {
        setTimeout(() => {
          window.cargarMezclas()
        }, 500)
      })
    }
  }

  // Función para recargar mezclas en la lista
  window.recargarMezclas = async () => {
    const mezclas = await handlers.handleObtenerMezclas()
    return mezclas
  }

  // ========== FUNCIONES ESPECÍFICAS PARA MEZCLAS.EJS ==========
  // Cargar y renderizar mezclas
  window.cargarMezclas = async () => {
    try {
      const mezclas = await handlers.handleObtenerMezclas()
      window.renderizarMezclas(mezclas)
    } catch (error) {
      console.error('Error cargando mezclas:', error)
    }
  }

  // Renderizar mezclas en cards
  window.renderizarMezclas = (mezclas) => {
    const container = document.getElementById('mezclasContainer')
    if (!container) return // Si no existe el container, no renderizar

    if (!mezclas || mezclas.length === 0) {
      container.innerHTML = '<div class="col-12 alert alert-info">No hay mezclas creadas. Crea una nueva.</div>'
      return
    }

    container.innerHTML = mezclas.map(mezcla => `
      <div class="col-lg-4 col-md-6 grid-margin stretch-card">
        <div class="card mezcla-card">
          <div class="badge-volumen">${mezcla.volumen_tanque}L</div>
          <div class="card-body">
            <h5 class="card-title">${mezcla.nombre}</h5>
            <p class="card-description text-muted"><small><b>${mezcla.fabricante || 'Sin fabricante'}</b></small></p>
            <p class="card-description text-muted text-small">${mezcla.descripcion || 'Sin descripción'}</p>
            
            <div class="mb-3">
              ${window.renderIngredientes(mezcla)}
            </div>

            <div class="btn-group btn-group-sm w-100" role="group">
              <button type="button" class="btn btn-outline-primary" onclick="window.editarMezcla(${mezcla.id})">
                <i class="mdi mdi-pencil"></i> Editar
              </button>
              <button type="button" class="btn btn-outline-info" onclick="window.verActivos(${mezcla.id})">
                <i class="mdi mdi-layers"></i> Ver
              </button>
              <button type="button" class="btn btn-outline-danger" onclick="window.eliminarMezcla(${mezcla.id})">
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('')
  }

  // Renderizar ingredientes de mezcla
  window.renderIngredientes = (mezcla) => {
    if (!mezcla.MezclaActivos || mezcla.MezclaActivos.length === 0) {
      return '<p class="sin-activos"><i class="mdi mdi-alert"></i> Sin ingredientes</p>'
    }

    return mezcla.MezclaActivos.map(ma => {
      const tipo = ma.ActivoMezcla?.tipo || 'OTRO'
      const clase = `type-${tipo.toLowerCase()}`
      return `<span class="macro-badge ${clase}">${ma.ActivoMezcla?.codigo || 'N/A'}: ${ma.cantidad} ${ma.unidad}</span>`
    }).join('')
  }

  // Inicializar mezclas si está en la página de mezclas
  window.inicializarMezclas = () => {
    window.cargarMezclas()

    // Evento para recargar cuando cierre el modal
    if (elementos.modalMezcla) {
      elementos.modalMezcla.addEventListener('hidden.bs.modal', () => {
        setTimeout(() => {
          window.cargarMezclas()
        }, 500)
      })
    }
  }

  // Auto-inicializar si estamos en la página de mezclas
  if (window.location.pathname.includes('mezclas') && document.getElementById('mezclasContainer')) {
    window.inicializarMezclas()
  }
})
