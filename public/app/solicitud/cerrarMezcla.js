/* eslint-disable no-undef */
import { CameraHandler } from '../camara.js'
import { mostrarMensaje } from '../mensajes.js'
import { showSpinner, hideSpinner } from '../spinner.js'
export class SolicitudFormulario {
  constructor () {
    this.initElements()
    this.bindEvents()
    this.cameraHandler = null
  }

  initElements () {
    this.elementos = {
      btnTomarFoto: document.getElementById('tomarFoto'),
      btnSubirFoto: document.getElementById('subirFoto'),
      inputImage: document.getElementById('InputImage'),
      fileImage: document.getElementById('fileImage'),
      imageFile: document.getElementById('imageFile'),
      canvas: document.getElementById('canvas1'),
      fileInput: document.getElementById('fileInput'),
      btnEntregada: document.getElementById('btnEntregada'),
      video: document.querySelector('#video'),
      listaDispositivos: document.querySelector('#listaDeDispositivos'),
      photo: document.querySelector('.photo')
    }
  }

  bindEvents () {
    this.elementos.btnTomarFoto.addEventListener('click', this.mostrarSeccionCamara.bind(this))
    this.elementos.btnSubirFoto.addEventListener('click', this.mostrarSeccionSubida.bind(this))
    this.elementos.imageFile.addEventListener('change', this.manejarSeleccionArchivo.bind(this))
    this.elementos.btnEntregada.addEventListener('click', this.validarYEnviarSolicitud.bind(this))
  }

  mostrarSeccionCamara () {
    this.elementos.inputImage.style.display = 'block'
    this.elementos.fileImage.style.display = 'none'
    // Inicializar el manejador de cámara si aún no existe
    if (!this.cameraHandler) {
      this.cameraHandler = new CameraHandler(this.elementos)
    }

    // Iniciar cámara
    this.cameraHandler.iniciarCamara()
  }

  mostrarSeccionSubida () {
    this.elementos.inputImage.style.display = 'none'
    this.elementos.fileImage.style.display = 'block'
  }

  manejarSeleccionArchivo (evento) {
    const archivo = evento.target.files[0]
    if (!archivo) return

    if (!this.validarArchivo(archivo)) return

    const lector = new FileReader()
    lector.onload = (e) => this.procesarImagen(e.target.result)
    lector.readAsDataURL(archivo)
  }

  validarArchivo (archivo) {
    const TAMAÑO_MAXIMO = 5 * 1024 * 1024 // 5MB
    const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

    if (archivo.size > TAMAÑO_MAXIMO) {
      this.mostrarError('El archivo es demasiado grande. Máximo 5MB.')
      return false
    }

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      this.mostrarError('Tipo de archivo no permitido. Solo se aceptan JPEG, PNG y WebP.')
      return false
    }

    return true
  }

  procesarImagen (fuenteImagen) {
    const imagen = new Image()
    imagen.onload = () => {
      const { ancho, alto } = this.calcularDimensiones(imagen)

      this.elementos.canvas.width = ancho
      this.elementos.canvas.height = alto

      const contexto = this.elementos.canvas.getContext('2d')
      contexto.drawImage(imagen, 0, 0, ancho, alto)

      const imagenBase64 = this.elementos.canvas.toDataURL('image/png')

      this.elementos.canvas.style.display = 'block'
      this.elementos.fileInput.value = imagenBase64
    }
    imagen.src = fuenteImagen
  }

  calcularDimensiones (imagen, anchoMaximo = 640, altoMaximo = 480) {
    let { width: ancho, height: alto } = imagen

    if (ancho > alto) {
      if (ancho > anchoMaximo) {
        alto = alto * (anchoMaximo / ancho)
        ancho = anchoMaximo
      }
    } else {
      if (alto > altoMaximo) {
        ancho = ancho * (altoMaximo / alto)
        alto = altoMaximo
      }
    }

    return { ancho, alto }
  }

  validarYEnviarSolicitud () {
    const fotoTomada = this.elementos.fileInput.value.trim() !== ''
    const archivoSubido = this.elementos.imageFile.files.length > 0

    if (!fotoTomada && !archivoSubido) {
      this.mostrarError('Por favor, tome una foto o suba un archivo.')
      return
    }

    this.enviarSolicitud(fotoTomada, archivoSubido)
  }

  async enviarSolicitud (fotoTomada, archivoSubido) {
    const datosFormulario = {}
    if (fotoTomada) {
      datosFormulario.imagen = this.elementos.fileInput.value // Base64
      datosFormulario.idSolicitud = document.getElementById('idSolicitud').value
    } else if (archivoSubido) {
      const archivo = this.elementos.imageFile.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        datosFormulario.imagen = event.target.result // Base64 del archivo subido
        this.realizarEnvio(datosFormulario)
      }

      reader.readAsDataURL(archivo)
      return
    }

    this.realizarEnvio(datosFormulario)
  }

  async realizarEnvio (datosFormulario) {
    try {
      showSpinner()
      const response = await fetch('/api/CerrarSolicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario)
      })
      const data = await response.json()
      if (response.ok) {
        return this.mostrarExito(data.message)
      }
      this.mostrarError(data.message)
    } catch (error) {
      hideSpinner()
      this.manejarError(error)
    } finally {
      hideSpinner()
    }
  }

  mostrarExito (mensaje) {
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl: '/protected/admin',
      redirectDelay: 500
    })
  }

  mostrarError (mensaje) {
    mostrarMensaje({
      msg: mensaje,
      type: 'error'
    })
  }

  manejarError (error) {
    console.error('Error:', error)
    this.mostrarError('Ocurrió un error inesperado')
  }
}

// Inicializar la clase cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())
