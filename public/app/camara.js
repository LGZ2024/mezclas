export class CameraHandler {
  constructor (elementos) {
    this.elementos = elementos
    this.stream = null
    this.currentDeviceId = null
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.init()
  }

  async init () {
    this.configurarBotonesCaptura()
    await this.checkPermisos()
    await this.iniciarCamara()
  }

  configurarBotonesCaptura () {
    // Usar delegación de eventos para mejor rendimiento
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btnTomarFoto')) {
        this.capturarFoto()
      } else if (e.target.matches('.btnOtraFoto')) {
        this.reiniciarCaptura()
      }
    })
  }

  async checkPermisos () {
    try {
      await navigator.permissions.query({ name: 'camera' })
    } catch (error) {
      console.warn('Verificación de permisos no soportada:', error)
    }
  }

  actualizarBotonesUI () {
    const btnTomarFoto = document.querySelector('.btnTomarFoto')
    const btnOtraFoto = document.querySelector('.btnOtraFoto')

    if (btnTomarFoto) {
      btnTomarFoto.style.display = 'none'
    }
    if (btnOtraFoto) {
      btnOtraFoto.style.display = 'block'
    }
  }

  async capturarFoto () {
    const { video, canvas, photo } = this.elementos

    try {
      if (!video?.srcObject) {
        throw new Error('Cámara no iniciada')
      }

      // Optimizar dimensiones según dispositivo
      const dimensions = this.calcularDimensiones(video)
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      const context = canvas.getContext('2d', { alpha: false })
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

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

  calcularDimensiones (video) {
    const maxWidth = this.isMobile ? 1280 : 640
    const maxHeight = this.isMobile ? 720 : 480

    let { videoWidth: width, videoHeight: height } = video

    if (width > maxWidth) {
      height = Math.round(height * (maxWidth / width))
      width = maxWidth
    }

    if (height > maxHeight) {
      width = Math.round(width * (maxHeight / height))
      height = maxHeight
    }

    return { width, height }
  }

  async optimizarImagen (canvas) {
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
      }, 'image/jpeg', 0.8)
    })
  }

  async cargarDispositivos () {
    const dispositivos = await navigator.mediaDevices.enumerateDevices()
    const dispositivosVideo = dispositivos.filter(d => d.kind === 'videoinput')

    if (dispositivosVideo.length === 0) {
      throw new Error('No se encontraron dispositivos de video')
    }
    const select = this.elementos.listaDispositivos
    if (select) {
      select.innerHTML = ''
      const dispositivosVideo = dispositivos.filter(d => d.kind === 'videoinput')

      if (dispositivosVideo.length === 0) {
        const option = document.createElement('option')
        option.text = 'No se encontraron dispositivos de video'
        select.appendChild(option)
        return
      }

      dispositivosVideo.forEach((dispositivo, index) => {
        const option = document.createElement('option')
        option.value = dispositivo.deviceId
        option.text = dispositivo.label || `Cámara ${index + 1}`
        select.appendChild(option)
      })

      select.onchange = () => {
        const deviceId = select.value
        this.iniciarCamara(deviceId)
      }
    } else {
      console.error('Elemento select no encontrado en el DOM')
    }
  }

  async iniciarCamara (deviceId = null) {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('API de cámara no soportada')
      }

      const constraints = this.getVideoConstraints(deviceId)
      await this.iniciarStream(constraints)
      await this.cargarDispositivos()
    } catch (error) {
      this.manejarError(error)
    }
  }

  getVideoConstraints (deviceId) {
    return {
      video: {
        width: { ideal: this.isMobile ? 1280 : 640 },
        height: { ideal: this.isMobile ? 720 : 480 },
        facingMode: this.isMobile ? 'environment' : 'user',
        deviceId: deviceId ? { exact: deviceId } : undefined
      }
    }
  }

  async iniciarStream (constraints) {
    this.detenerStream()
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.stream = stream

    if (this.elementos.video) {
      this.elementos.video.srcObject = stream
      await this.elementos.video.play()
    }
  }

  toggleElementos (estados) {
    Object.entries(estados).forEach(([elemento, mostrar]) => {
      if (this.elementos[elemento]) {
        this.elementos[elemento].style.display = mostrar ? 'block' : 'none'
      }
    })
  }

  reiniciarCaptura () {
    this.toggleElementos({
      video: true,
      photo: false
    })

    if (this.elementos.fileInput) {
      this.elementos.fileInput.value = ''
    }

    this.iniciarCamara(this.currentDeviceId)
  }

  detenerStream () {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  manejarError (error) {
    console.error('Error de cámara:', error)
    const mensaje = this.getMensajeError(error)

    if (this.elementos.estado) {
      this.elementos.estado.textContent = mensaje
      this.elementos.estado.classList.add('error')
    }
  }

  getMensajeError (error) {
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
