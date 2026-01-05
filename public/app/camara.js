export class CameraHandler {
  constructor(elementos) {
    this.elementos = elementos
    this.stream = null
    this.currentDeviceId = null
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.isFlashOn = false
    this.init()
  }

  async init() {
    this.configurarBotonesCaptura()
    this.configurarSelectorCamara()
    await this.checkPermisos()
    // 1. Inicia la cámara con la opción por defecto (trasera en móvil).
    await this.iniciarCamara()
    // 2. Una vez que hay un stream, carga la lista de dispositivos.
    //   Esto es crucial para que los nombres de las cámaras aparezcan correctamente.
    await this.cargarDispositivos()
  }

  configurarBotonesCaptura() {
    // Usar delegación de eventos para mejor rendimiento
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btnTomarFoto')) {
        this.capturarFoto()
      } else if (e.target.matches('.btnOtraFoto')) {
        this.reiniciarCaptura()
      } else if (e.target.matches('.btnFlipCamera')) {
        this.flipCamera()
      } else if (e.target.matches('.btnToggleFlash')) {
        this.toggleFlash()
      }
    })
  }

  configurarSelectorCamara() {
    const select = this.elementos.listaDeDispositivos
    if (select) {
      select.addEventListener('change', this.handleDeviceChange.bind(this))
    }
  }

  handleDeviceChange(event) {
    const deviceId = event.target.value
    this.iniciarCamara({ deviceId })
  }

  async checkPermisos() {
    try {
      await navigator.permissions.query({ name: 'camera' })
    } catch (error) {
      console.warn('Verificación de permisos no soportada:', error)
    }
  }

  actualizarBotonesUI() {
    const btnTomarFoto = document.querySelector('.btnTomarFoto')
    const btnOtraFoto = document.querySelector('.btnOtraFoto')
    const btnFlipCamera = document.querySelector('.btnFlipCamera')

    if (btnTomarFoto) {
      btnTomarFoto.style.display = 'none'
    }
    if (btnOtraFoto) {
      btnOtraFoto.style.display = 'block'
    }
    if (btnFlipCamera) {
      btnFlipCamera.style.display = 'none'
    }
  }

  async capturarFoto() {
    const { video, canvas, photo } = this.elementos

    try {
      if (!video?.srcObject) {
        throw new Error('Cámara no iniciada')
      }

      // Capturar a la resolución nativa del video para máxima calidad
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d', { alpha: false })
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Añadir la marca de agua con la fecha y hora
      this.addWatermark(canvas, context)

      const blob = await this.optimizarImagen(canvas)
      if (!blob) {
        throw new Error('Error al procesar la imagen')
      }

      const imageUrl = URL.createObjectURL(blob)
      photo.onload = () => URL.revokeObjectURL(imageUrl)
      photo.src = imageUrl

      this.toggleElementos({ photo: true, video: false })
      this.actualizarBotonesUI()
      this.detenerStream()

      return blob
    } catch (error) {
      console.error('Error en capturarFoto:', error)
      throw error
    }
  }

  addWatermark(canvas, context) {
    const fechaHora = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // Ajustar el tamaño de la fuente en función del ancho de la imagen
    const fontSize = Math.max(18, Math.round(canvas.width / 60))
    context.font = `bold ${fontSize}px Arial`
    context.fillStyle = 'rgba(255, 255, 255, 0.75)' // Blanco semi-transparente
    context.textAlign = 'right'
    context.textBaseline = 'bottom'

    // Añadir una pequeña sombra para mejorar la legibilidad
    context.shadowColor = 'rgba(0, 0, 0, 0.5)'
    context.shadowBlur = 5
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2

    // Dibujar el texto en la esquina inferior derecha
    context.fillText(fechaHora, canvas.width - 15, canvas.height - 15)

    // Resetear la sombra para no afectar otros dibujos
    context.shadowColor = 'transparent'
    context.shadowBlur = 0
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
  }

  /**
   * Voltea entre la cámara frontal y trasera.
   */
  async flipCamera() {
    if (!this.stream) return
    const currentSettings = this.stream.getVideoTracks()[0].getSettings()
    const newFacingMode = currentSettings.facingMode === 'user' ? 'environment' : 'user'

    // Reinicia la cámara pidiendo el modo opuesto.
    await this.iniciarCamara({ facingMode: newFacingMode })
  }

  /**
   * Activa o desactiva el flash (torch).
   */
  async toggleFlash() {
    if (!this.stream) return
    const track = this.stream.getVideoTracks()[0]
    const capabilities = track.getCapabilities()

    if (capabilities.torch) {
      this.isFlashOn = !this.isFlashOn
      await track.applyConstraints({
        advanced: [{ torch: this.isFlashOn }]
      })
      // Actualizar UI del botón
      const flashIcon = document.querySelector('.btnToggleFlash i')
      if (flashIcon) {
        flashIcon.className = this.isFlashOn ? 'mdi mdi-flash' : 'mdi mdi-flash-off'
      }
    }
  }

  async optimizarImagen(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(new Blob([], { type: 'image/jpeg' }))
          return
        }
        // Comprimir si es necesario
        if (blob.size > 1024 * 1024) { // > 1MB
          canvas.toBlob(resolve, 'image/jpeg', 0.7)
        } else {
          resolve(blob)
        }
      }, 'image/jpeg', 0.92) // Aumentamos la calidad a 92%
    })
  }

  async cargarDispositivos() {
    const select = this.elementos.listaDispositivos
    if (!select) {
      console.error('Elemento select no encontrado en el DOM')
      return
    }

    try {
      const dispositivos = await navigator.mediaDevices.enumerateDevices()
      const dispositivosVideo = dispositivos.filter(d => d.kind === 'videoinput')

      if (dispositivosVideo.length === 0) {
        select.innerHTML = '<option value="">No se encontraron cámaras</option>'
        return
      }

      // Guardar el ID del dispositivo actual para mantener la selección
      const currentTrack = this.stream?.getVideoTracks()[0]
      const currentId = currentTrack?.getSettings().deviceId

      select.innerHTML = '' // Limpiar lista
      dispositivosVideo.forEach((dispositivo) => {
        const option = document.createElement('option')
        option.value = dispositivo.deviceId
        option.text = dispositivo.label || `Cámara ${dispositivosVideo.indexOf(dispositivo) + 1}`
        select.appendChild(option)
      })

      // Restaurar la selección si es posible
      if (currentId) {
        select.value = currentId
      }
    } catch (error) {
      console.error('Error al cargar dispositivos:', error)
      select.innerHTML = '<option value="">Error al cargar cámaras</option>'
    }
  }

  async iniciarCamara(options = {}) {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('API de cámara no soportada')
      }
      // Obtiene las restricciones de video, usando las nuevas opciones o el ID actual.
      const constraints = this.getVideoConstraints(options)

      // Inicia el nuevo stream de video. Esta es su única tarea.
      await this.iniciarStream(constraints)
    } catch (error) {
      this.manejarError(error)
    }
  }

  getVideoConstraints(options = {}) {
    const { deviceId, facingMode } = options
    const constraints = {
      width: { ideal: 1920 }, // Aumentamos la resolución ideal a Full HD
      height: { ideal: 1080 }
    }

    if (deviceId || this.currentDeviceId) {
      // Si se especifica un ID, se prioriza esa cámara.
      constraints.deviceId = { exact: deviceId || this.currentDeviceId }
    } else if (facingMode) {
      constraints.facingMode = facingMode
    } else {
      // Si no hay ID, se usa facingMode para elegir entre trasera/frontal.
      constraints.facingMode = this.isMobile ? 'environment' : 'user'
    }
    return { video: constraints }
  }

  async iniciarStream(constraints) {
    this.detenerStream()
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.stream = stream

    if (this.elementos.video) {
      this.elementos.video.srcObject = stream
      await this.elementos.video.play()
      this.verificarCapacidadesAvanzadas(stream)
    }
  }

  /**
   * Verifica las capacidades como zoom y flash y muestra/oculta los controles.
   */
  verificarCapacidadesAvanzadas(stream) {
    const track = stream.getVideoTracks()[0]
    if (!track) return

    const capabilities = track.getCapabilities()

    // Control de Flash
    const flashControl = document.querySelector('.btnToggleFlash')
    if (flashControl) {
      flashControl.style.display = capabilities.torch ? 'inline-block' : 'none'
    }
  }

  toggleElementos(estados) {
    Object.entries(estados).forEach(([elemento, mostrar]) => {
      if (this.elementos[elemento]) {
        this.elementos[elemento].style.display = mostrar ? 'block' : 'none'
      }
    })
  }

  reiniciarCaptura() {
    // Oculta la foto y muestra el video
    this.toggleElementos({
      video: true,
      photo: false
    })

    // Restablece los botones a su estado inicial
    const btnTomarFoto = document.querySelector('.btnTomarFoto')
    const btnOtraFoto = document.querySelector('.btnOtraFoto')
    const btnFlipCamera = document.querySelector('.btnFlipCamera')

    if (btnTomarFoto) btnTomarFoto.style.display = 'inline-block'
    if (btnOtraFoto) btnOtraFoto.style.display = 'none'
    if (btnFlipCamera) btnFlipCamera.style.display = 'inline-block'

    if (this.elementos.fileInput) {
      this.elementos.fileInput.value = ''
    }

    // Si el stream ya no existe (porque se detuvo), lo reinicia.
    if (!this.stream) {
      this.iniciarCamara({ deviceId: this.currentDeviceId })
    }
  }

  detenerStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  manejarError(error) {
    console.error('Error de cámara:', error)
    const mensaje = this.getMensajeError(error)

    if (this.elementos.estado) {
      this.elementos.estado.textContent = mensaje
      this.elementos.estado.classList.add('error')
    }
  }

  getMensajeError(error) {
    const errores = {
      NotAllowedError: 'Permiso de cámara denegado',
      NotFoundError: 'No se encontró cámara',
      NotReadableError: 'La cámara está en uso',
      OverconstrainedError: 'Resolución no soportada',
      AbortError: 'Acceso a cámara cancelado',
      default: 'Error al acceder a la cámara'
    }

    return errores[error.name] || errores.default
  }
}
