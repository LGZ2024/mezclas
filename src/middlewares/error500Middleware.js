const error500 = async (req, res, next) => {
  return res.status(500).render('500', { error: 'Error interno del servidor' })
}

const error404 = async (req, res, next) => {
  res.status(404).render('404', { error: 'Página no encontrada' })
}
export { error500, error404 }
