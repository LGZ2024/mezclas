import multer from 'multer'
import path from 'path'

// 1. Fotos del módulo mezclas
const storageMezclas = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('src/uploads/fotos_mezclas'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `mezcla_${Date.now()}_${Math.random().toString(36).substring(2)}${ext}`)
  }
})
const fileFilterMezclas = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Solo se permiten imágenes para mezclas'), false)
}
export const uploadFotoMezclas = multer({ storage: storageMezclas, fileFilter: fileFilterMezclas })

// 2. Archivos de activos (foto, factura, documento de baja)
const storageActivos = multer.diskStorage({
  destination: (req, file, cb) => {
    // Subcarpetas según el campo
    let subfolder = ''
    if (file.fieldname === 'foto') subfolder = 'foto'
    else if (file.fieldname === 'factura') subfolder = 'factura'
    else if (file.fieldname === 'baja') subfolder = 'baja'
    else subfolder = 'otros'
    cb(null, path.resolve(`src/uploads/activos/${subfolder}`))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}_${Date.now()}_${Math.random().toString(36).substring(2)}${ext}`)
  }
})
const fileFilterActivos = (req, file, cb) => {
  // foto: imagen, factura y baja: PDF
  if (file.fieldname === 'foto' && file.mimetype.startsWith('image/')) cb(null, true)
  else if ((file.fieldname === 'factura' || file.fieldname === 'baja') && file.mimetype === 'application/pdf') cb(null, true)
  else cb(new Error('Tipo de archivo no permitido para activos'), false)
}
// Para múltiples campos
export const uploadArchivosActivos = multer({ storage: storageActivos, fileFilter: fileFilterActivos })

// 3. Responsivas de activos (PDF)
const storageResponsivas = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('src/uploads/responsivas_activos'))
  },
  filename: (req, file, cb) => {
    cb(null, `responsiva_${Date.now()}_${Math.random().toString(36).substring(2)}.pdf`)
  }
})
const fileFilterResponsivas = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true)
  else cb(new Error('Solo se permiten archivos PDF para responsivas'), false)
}
export const uploadResponsiva = multer({ storage: storageResponsivas, fileFilter: fileFilterResponsivas })
