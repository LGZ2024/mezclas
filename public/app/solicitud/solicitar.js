import { centrosCoste, Variedades } from '../CentrosCoste.js'
import { CameraHandler } from '../camara.js'
import { mostrarMensaje } from '../mensajes.js'
class SolicitudFormulario {
  constructor () {
    this.initElements()
    this.bindEvents()
    this.cameraHandler = null
  }

  initElements () {
    this.elementos = {
      regresar: document.getElementById('regresar'),
      rancho: document.querySelector('#rancho'),
      centroCoste: document.querySelector('#centroCoste'),
      btnTomarFoto: document.getElementById('tomarFoto'),
      btnSubirFoto: document.getElementById('subirFoto'),
      inputImage: document.getElementById('InputImage'),
      fileImage: document.getElementById('fileImage'),
      imageFile: document.getElementById('imageFile'),
      canvas: document.getElementById('canvas1'),
      fileInput: document.getElementById('fileInput'),
      btnSolicitar: document.getElementById('btnSolicitar'),
      //
      video: document.querySelector('#video'),
      listaDispositivos: document.querySelector('#listaDeDispositivos'),
      photo: document.querySelector('.photo')
    }
  }

  bindEvents () {
    this.elementos.regresar.addEventListener('click', this.navegarInicio)
    this.elementos.rancho.addEventListener('change', this.manejarCambioRancho)
    this.elementos.centroCoste.addEventListener('change', this.manejarCambioCentroCoste)
    this.elementos.btnTomarFoto.addEventListener('click', this.mostrarSeccionCamara)
    this.elementos.btnSubirFoto.addEventListener('click', this.mostrarSeccionSubida)
    this.elementos.imageFile.addEventListener('change', this.manejarSeleccionArchivo.bind(this))
    this.elementos.btnSolicitar.addEventListener('click', this.validarYEnviarSolicitud.bind(this))
  }

  navegarInicio = () => {
    window.location.href = '/protected/admin'
  }

  manejarCambioRancho = (evento) => {
    const rancho = evento.target.value
    this.ejecutarSeguros(() => centrosCoste(rancho))
  }

  manejarCambioCentroCoste = (evento) => {
    const id = evento.target.value
    this.ejecutarSeguros(() => Variedades(id))
  }

  ejecutarSeguros (callback) {
    try {
      callback()
    } catch (error) {
      this.manejarError(error)
    }
  }

  mostrarSeccionCamara = () => {
    this.elementos.inputImage.style.display = 'block'
    this.elementos.fileImage.style.display = 'none'
    // Inicializar el manejador de cámara si aún no existe
    if (!this.cameraHandler) {
      this.cameraHandler = new CameraHandler(this.elementos)
    }

    // Iniciar cámara
    this.cameraHandler.iniciarCamara()
  }

  mostrarSeccionSubida = () => {
    this.elementos.inputImage.style.display = 'none'
    this.elementos.fileImage.style.display = 'block'
  }

  manejarSeleccionArchivo (evento) {
    const archivo = evento.target.files[0]
    if (!archivo) return

    this.validarArchivo(archivo)

    // eslint-disable-next-line no-undef
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
    // eslint-disable-next-line no-undef
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
    const camposRequeridos = [
      'rancho', 'centroCoste', 'variedad', 'folio',
      'temporada', 'cantidad', 'presentacion',
      'metodoAplicacion', 'descripcion'
    ]

    // Verificar campos requeridos
    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      this.mostrarError(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`)
      return
    }
    // Validar si se tomó una foto o se subió un archivo
    const fotoTomada = document.getElementById('fileInput').value.trim() !== ''
    const archivoSubido = document.getElementById('imageFile').files.length > 0

    if (!fotoTomada && !archivoSubido) {
      this.mostrarError('Por favor, tome una foto o suba un archivo.')
      return
    }
    // OBTENEMOS DATOS DEL CENTRO DE COTE PARA SABER LA EMPRESA A LA QUE PERTENECE
    const centroCosteSelect = document.getElementById('centroCoste')
    const selectedIndex = centroCosteSelect.selectedIndex
    const selectedOption = centroCosteSelect.options[selectedIndex]
    const selectedText = selectedOption.text
    let empresaPertece = ''

    if (selectedText.substring(0, 4) === 'MFIM') {
      empresaPertece = 'Moras Finas'
    } else if (selectedText.substring(0, 4) === 'BCEM') {
      empresaPertece = 'Bayas del Centro'
    } else if (selectedText.substring(0, 4) === 'BIOJ') {
      empresaPertece = 'Bioagricultura'
    }

    this.enviarSolicitud(fotoTomada, archivoSubido, empresaPertece)
  }

  enviarSolicitud (fotoTomada, archivoSubido, empresaPertece) {
    const datosFormulario = {
      rancho: document.getElementById('rancho').value,
      centroCoste: document.getElementById('centroCoste').value,
      variedad: document.getElementById('variedad').value,
      folio: document.getElementById('folio').value,
      temporada: document.getElementById('temporada').value,
      cantidad: document.getElementById('cantidad').value,
      presentacion: document.getElementById('presentacion').value,
      metodoAplicacion: document.getElementById('metodoAplicacion').value,
      descripcion: document.getElementById('descripcion').value,
      empresaPertece
    }
    // Determinar qué imagen incluir
    if (fotoTomada) {
      datosFormulario.imagen = document.getElementById('fileInput').value // Base64
    } else if (archivoSubido) {
      const archivo = document.getElementById('imageFile').files[0]
      // eslint-disable-next-line no-undef
      const reader = new FileReader()

      reader.onload = (event) => {
        datosFormulario.imagen = event.target.result // Base64 del archivo subido

        // Enviar la solicitud después de leer el archivo
        this.realizarEnvio(datosFormulario)
      }

      reader.readAsDataURL(archivo) // Leer el archivo como Data URL
      return // Salir para esperar la carga del archivo
    }

    // Si solo hay foto tomada, enviar directamente
    this.realizarEnvio(datosFormulario)
  }

  realizarEnvio (datosFormulario) {
    fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosFormulario)
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        console.log(datos)
        if (datos.message) {
          this.mostrarExito(datos.message)
          // Resetear formulario o redirigir
        } else {
          this.mostrarError(datos.error)
        }
      })
      .catch(error => {
        this.manejarError(error)
      })
  }

  mostrarExito (mensaje) {
    console.log(mensaje)
    mostrarMensaje({
      msg: mensaje,
      type: 'success',
      redirectUrl: '/protected/admin'
    })
  }

  mostrarError (mensaje) {
    console.log(mensaje)
  }

  manejarError (error) {
    console.error('Error:', error)
    this.mostrarError('Ocurrió un error inesperado')
  }
}

// Inicializar la clase cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())
