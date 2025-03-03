const error500 = async (req, res, next) => {
  return res.status(500).render('errorPage', { codeError: '500', title: '500 - Error en el servidor', errorMsg: 'Error interno del servidor' })
}

const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', { codeError: '404', title: '404 - Página no encontrada', errorMsg: 'La página que buscas no fue encontrada.' })
}
export { error500, error404 }
