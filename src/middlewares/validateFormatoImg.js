export const validateImageFile = (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' })
  }

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
  const fileExtension = req.files.image.name.split('.').pop().toLowerCase()

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      error: 'Formato de archivo no válido. Use: ' + validExtensions.join(', ')
    })
  }

  next()
}
export const validateBase64Image = (req, res, next) => {
  const { image } = req.body

  if (!image) {
    return res.status(400).json({ error: 'No se ha enviado ninguna imagen' })
  }

  // Verificar que sea una cadena base64 válida
  if (!isValidBase64(image)) {
    return res.status(400).json({ error: 'La imagen no está en formato base64 válido' })
  }

  // Obtener el tipo de archivo desde el base64
  const matches = image.match(/^data:image\/(.*?);base64,/)

  if (!matches) {
    return res.status(400).json({ error: 'Formato de imagen no válido' })
  }

  const fileExtension = matches[1].toLowerCase()
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      error: `Formato de archivo no válido. Use: ${validExtensions.join(', ')}`
    })
  }

  // Limitar tamaño (ejemplo: 5MB)
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
  const fileSize = Buffer.from(base64Data, 'base64').length
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (fileSize > maxSize) {
    return res.status(400).json({
      error: 'La imagen excede el tamaño máximo permitido (5MB)'
    })
  }

  // Si todo está bien, continuamos
  next()
}

// Función auxiliar para validar base64
const isValidBase64 = (str) => {
  if (!str?.startsWith('data:image/')) return false

  try {
    const base64Data = str.split(',')[1]
    return Buffer.from(base64Data, 'base64').toString('base64') === base64Data
  } catch (e) {
    return false
  }
}
