import fs from 'fs'
import path from 'path'

const getPort = () => {
  try {
    // Leer los logs de la aplicación
    const logPath = path.join(process.cwd(), 'logs', 'app.log')
    const logs = fs.readFileSync(logPath, 'utf8')

    // Buscar la última entrada de puerto
    const portMatch = logs.match(/Puerto asignado: (\d+)/g)
    if (portMatch) {
      const lastPort = portMatch[portMatch.length - 1]
      const port = lastPort.match(/\d+/)[0]
      console.log(`Puerto actual: ${port}`)
      return port
    }

    console.log('No se encontró información del puerto')
    return null
  } catch (error) {
    console.error('Error al obtener el puerto:', error.message)
    return null
  }
}

getPort()
