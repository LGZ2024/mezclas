const validateJSON = async (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido' })
  }
  next()
}
export { validateJSON }
