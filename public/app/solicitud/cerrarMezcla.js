/* eslint-disable no-undef */
import { CameraHandler } from '../camara.js'
import { mostrarMensaje } from '../mensajes.js'
import { showSpinner, hideSpinner } from '../spinner.js'
export class SolicitudFormulario {
  constructor () {
    this.initElements()
    this.bindEvents()
    this.cameraHandler = null
    this.imagenBlob = null
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

    // Advertencia si faltan elementos críticos
    const elementosCriticos = ['btnTomarFoto', 'btnSubirFoto', 'imageFile', 'btnEntregada', 'canvas']
    elementosCriticos.forEach(elem => {
      if (!this.elementos[elem]) {
        console.warn(`⚠️ Elemento crítico no encontrado: ${elem}`)
      }
    })
  }

  bindEvents () {
    // Verificar que los elementos existan antes de agregar event listeners
    if (this.elementos.btnTomarFoto) {
      this.elementos.btnTomarFoto.addEventListener('click', this.mostrarSeccionCamara.bind(this))
    }

    if (this.elementos.btnSubirFoto) {
      this.elementos.btnSubirFoto.addEventListener('click', this.mostrarSeccionSubida.bind(this))
    }

    if (this.elementos.imageFile) {
      this.elementos.imageFile.addEventListener('change', this.manejarSeleccionArchivo.bind(this))
    }

    if (this.elementos.btnEntregada) {
      this.elementos.btnEntregada.addEventListener('click', this.validarYEnviarSolicitud.bind(this))
    }

    // Agregar evento para captura de foto
    const btnTomarFoto = document.querySelector('.btnTomarFoto')
    if (btnTomarFoto) {
      btnTomarFoto.addEventListener('click', async () => {
        try {
          if (this.cameraHandler) {
            this.imagenBlob = await this.cameraHandler.capturarFoto()
            if (this.imagenBlob) {
              this.elementos.canvas.style.display = 'block'
              console.log('Foto capturada correctamente')
            }
          }
        } catch (error) {
          console.error('Error al capturar foto:', error)
          this.mostrarError('Error al capturar la foto. Por favor, intente nuevamente.')
        }
      })
    }
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

  async procesarImagen (fuenteImagen) {
    const imagen = new Image()

    // Crear una promesa para manejar la carga de la imagen
    await new Promise((resolve) => {
      imagen.onload = resolve
      imagen.src = fuenteImagen
    })

    const { ancho, alto } = this.calcularDimensiones(imagen)
    this.elementos.canvas.width = ancho
    this.elementos.canvas.height = alto

    const contexto = this.elementos.canvas.getContext('2d')
    contexto.drawImage(imagen, 0, 0, ancho, alto)

    // Almacenar el blob para usarlo después
    this.imagenBlob = await new Promise(resolve => {
      this.elementos.canvas.toBlob(resolve, 'image/jpeg', 0.8)
    })

    this.elementos.canvas.style.display = 'block'
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
    // Agregar log para depuración
    console.log('Estado del blob:', this.imagenBlob)
    console.log('Estado de archivos:', this.elementos.imageFile.files)

    const fotoTomada = this.imagenBlob !== null
    const archivoSubido = this.elementos.imageFile.files.length > 0

    if (!fotoTomada && !archivoSubido) {
      this.mostrarError('Por favor, tome una foto o suba un archivo.')
      return
    }

    this.enviarSolicitud(fotoTomada, archivoSubido)
  }

  async enviarSolicitud (fotoTomada, archivoSubido) {
    try {
      const formData = new FormData()
      const id = document.getElementById('idSolicitud').value
      formData.append('idSolicitud', id)

      if (fotoTomada && this.imagenBlob) {
        console.log('Enviando foto tomada')
        formData.append('imagen', this.imagenBlob, 'foto_camara.jpg')
      } else if (archivoSubido) {
        console.log('Enviando archivo subido')
        const archivo = this.elementos.imageFile.files[0]
        if (!this.validarArchivo(archivo)) return
        formData.append('imagen', archivo)
      }

      await this.realizarEnvio(formData)
    } catch (error) {
      this.manejarError(error)
    }
  }

  async realizarEnvio (formData) {
    const id = document.getElementById('idSolicitud').value
    try {
      showSpinner()
      const url = `/api/CerrarSolicitud/${id}`
      const response = await fetch(url, {
        method: 'PUT',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        return this.mostrarExito(data.message)
      }
      this.mostrarError(data.message)
    } catch (error) {
      this.manejarError(error)
    } finally {
      hideSpinner()
    }
  }

  mostrarExito (mensaje) {
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl: '/protected/proceso',
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
