export class CameraHandler {
  constructor (elementos) {
    this.elementos = elementos
    this.stream = null
    this.configurarBotonesCaptura()
  }

  configurarBotonesCaptura () {
    const botonCapturar = document.querySelector('.btnTomarFoto')
    if (botonCapturar) {
      botonCapturar.onclick = () => this.capturarFoto()
    }

    const botonReiniciar = document.querySelector('.btnOtraFoto')
    if (botonReiniciar) {
      botonReiniciar.onclick = () => this.reiniciarCaptura()
    }
  }

  async capturarFoto () {
    const { video, canvas, photo } = this.elementos

    try {
      // Asegurarse de que el video esté reproduciéndose
      if (!video.srcObject) {
        throw new Error('La cámara no está iniciada')
      }

      // Configurar canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convertir a Blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8)
      })

      if (!blob) {
        throw new Error('Error al crear el blob de la imagen')
      }

      // Crear URL para preview
      const imageUrl = URL.createObjectURL(blob)
      photo.src = imageUrl
      photo.style.display = 'block'
      video.style.display = 'none'

      // Actualizar UI
      this.actualizarBotonesUI()

      // Detener cámara
      this.detenerStream()

      return blob
    } catch (error) {
      console.error('Error al capturar foto:', error)
      throw error
    }
  }

  actualizarBotonesUI () {
    const botonOtraFoto = document.querySelector('.btnOtraFoto')
    const btnTomarFoto = document.querySelector('.btnTomarFoto')

    if (botonOtraFoto && btnTomarFoto) {
      botonOtraFoto.style.display = 'block'
      btnTomarFoto.style.display = 'none'
    }
  }

  reiniciarCaptura () {
    const { video, photo } = this.elementos
    const botonOtraFoto = document.querySelector('.btnOtraFoto')
    const btnTomarFoto = document.querySelector('.btnTomarFoto')

    if (video && photo && botonOtraFoto) {
      video.style.display = 'block'
      photo.style.display = 'none'
      botonOtraFoto.style.display = 'none'
      btnTomarFoto.style.display = 'block'
      photo.src = ''

      const fileInput = document.getElementById('fileInput')
      if (fileInput) {
        fileInput.value = ''
      }

      this.iniciarCamara()
    }
  }

  async iniciarCamara (deviceId) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta la captura de video')
      }
      const dispositivos = await navigator.mediaDevices.enumerateDevices()
      const dispositivosVideo = dispositivos.filter(d => d.kind === 'videoinput')

      if (dispositivosVideo.length === 0) {
        throw new Error('No se encontraron dispositivos de video')
      }

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      }

      this.detenerStream()

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.stream = stream
      const { video } = this.elementos

      if (video) {
        video.srcObject = stream
        await video.play()
      }

      this.llenarSelectDispositivos(dispositivosVideo)
    } catch (error) {
      console.error('Error al iniciar la cámara:', error)
      this.manejarError(error)
    }
  }

  llenarSelectDispositivos (dispositivos) {
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

  detenerStream () {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  manejarError (error) {
    const estadoElemento = document.getElementById('estado')
    if (estadoElemento) {
      estadoElemento.textContent = `Error: ${error.message}`
      estadoElemento.style.color = 'red'
    }
    console.error(error)
  }
}
