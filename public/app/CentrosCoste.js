import { setPost, setPostVariedad } from './postList.js'

async function centrosCoste (rancho) {
  const response = await fetchCC(rancho)
  setPost(response)
}
async function Variedades (id) {
  const response = await fetchVariedad(id)
  setPostVariedad(response)
}
async function cambioSolicitud (selecion) {
  const cantidad = document.getElementById('cantidad')
  const presentacion = document.getElementById('presentacion')
  const folio = document.getElementById('folio')
  if (selecion === 'todo') {
    cantidad.disabled = true
    cantidad.required = false

    presentacion.disabled = true
    presentacion.required = false

    folio.disabled = true
    folio.required = false
  } else {
    cantidad.disabled = false
    cantidad.required = true

    presentacion.disabled = false
    presentacion.required = true

    folio.disabled = false
    folio.required = true
  }
}
async function fetchCC (rancho) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(`/api/cc/${rancho}`, options)
  const data = await response.json()
  return data
}

async function fetchVariedad (id) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(`/api/variedades/${id}`, options)
  const data = await response.json()
  return data
}
export { centrosCoste, Variedades, cambioSolicitud }
