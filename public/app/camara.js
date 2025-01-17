export class CameraHandler {
  constructor (elementos) {
    this.elementos = elementos
    this.stream = null
    this.configurarBotonesCaptura()
  }

  configurarBotonesCaptura () {
    // Botón para tomar foto
    const botonCapturar = document.querySelector('.btnTomarFoto')
    if (botonCapturar) {
      botonCapturar.onclick = () => {
        this.capturarFoto()
      }
    }

    // Botón para tomar otra foto / reiniciar
    const botonReiniciar = document.querySelector('.btnOtraFoto')
    if (botonReiniciar) {
      botonReiniciar.onclick = () => {
        this.reiniciarCaptura()
      }
    }
  }

  capturarFoto () {
    const video = this.elementos.video
    const canvas = document.getElementById('canvas')
    const photo = document.querySelector('.photo')
    const botonOtraFoto = document.querySelector('.btnOtraFoto')
    const btnTomarFoto = document.querySelector('.btnTomarFoto')

    if (video && canvas && photo) {
      const context = canvas.getContext('2d')

      // Establecer el tamaño del canvas igual al video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame actual del video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convertir el canvas a una imagen
      const dataUrl = canvas.toDataURL('image/png')

      // Mostrar la imagen capturada
      photo.src = dataUrl
      photo.style.display = 'block'

      // Ocultar video
      video.style.display = 'none'

      // Mostrar botón para tomar otra foto
      if (botonOtraFoto) {
        botonOtraFoto.style.display = 'block'
        btnTomarFoto.style.display = 'none'
      }

      // Guardar la imagen en el campo de entrada
      const fileInput = document.getElementById('fileInput')
      if (fileInput) {
        fileInput.value = dataUrl
      }

      // Detener el stream de video
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }
    }
  }

  reiniciarCaptura () {
    const video = this.elementos.video
    const photo = document.querySelector('.photo')
    const botonOtraFoto = document.querySelector('.btnOtraFoto')
    const btnTomarFoto = document.querySelector('.btnTomarFoto')

    if (video && photo && botonOtraFoto) {
      // Restablecer la visibilidad
      video.style.display = 'block'
      photo.style.display = 'none'
      botonOtraFoto.style.display = 'none'
      btnTomarFoto.style.display = 'block'

      // Limpiar la imagen
      photo.src = ''

      // Limpiar el campo de entrada
      const fileInput = document.getElementById('fileInput')
      if (fileInput) {
        fileInput.value = ''
      }

      // Reiniciar el stream de video
      this.iniciarCamara()
    }
  }

  async iniciarCamara (deviceId) {
    try {
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

      // Detener el stream anterior si existe
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      this.stream = stream
      const video = this.elementos.video

      if (video) {
        video.srcObject = stream
        video.play()
      }

      // Llenar el select solo si no está lleno
      if (!this.elementos.listaDispositivos.options.length) {
        this.llenarSelectDispositivos(dispositivosVideo)
      }
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
        option.text = `Cámara ${index + 1}`
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

  manejarError (error) {
    const estadoElemento = document.getElementById('estado')
    if (estadoElemento) {
      estadoElemento.textContent = `Error: ${error.message}`
      estadoElemento.style.color = 'red'
    }
    console.error(error)
  }
}
