// scripts/verify-pwa.mjs
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

async function checkFile (filepath, description) {
  try {
    await fs.access(filepath)
    console.log(`✅ ${description} encontrado`)
    return true
  } catch {
    console.error(`❌ ${description} no encontrado en ${filepath}`)
    return false
  }
}

async function verifyPWA () {
  console.log('Verificando configuración de PWA...\n')

  let allValid = true

  const filesToCheck = [
    { path: 'public/manifest.json', desc: 'Manifest' },
    { path: 'public/service-worker.js', desc: 'Service Worker' },
    { path: 'public/offline.html', desc: 'Página offline' },
    { path: 'public/js/app.js', desc: 'Script principal' },
    { path: 'public/css/pwa.css', desc: 'Estilos PWA' },
    { path: 'public/images/LogoTransp.png', desc: 'Ícono PNG' },
    { path: 'public/images/LogoTransp.webp', desc: 'Ícono WebP' }
  ]

  for (const file of filesToCheck) {
    const isValid = await checkFile(path.join(rootDir, file.path), file.desc)
    allValid = allValid && isValid
  }

  // Verificar manifest.json
  try {
    const manifestContent = JSON.parse(
      await fs.readFile(path.join(rootDir, 'public/manifest.json'), 'utf8')
    )

    const requiredFields = [
      'name',
      'short_name',
      'start_url',
      'display',
      'background_color',
      'theme_color',
      'icons'
    ]

    for (const field of requiredFields) {
      if (!manifestContent[field]) {
        console.error(`❌ Campo requerido '${field}' falta en manifest.json`)
        allValid = false
      }
    }

    if (!manifestContent.icons.some(icon => icon.sizes === '512x512')) {
      console.error('❌ Falta ícono de 512x512 en manifest.json')
      allValid = false
    }
  } catch (error) {
    console.error('❌ Error al leer o parsear manifest.json:', error.message)
    allValid = false
  }

  // Verificar service-worker.js
  try {
    const swContent = await fs.readFile(
      path.join(rootDir, 'public/service-worker.js'),
      'utf8'
    )

    const requiredEvents = ['install', 'activate', 'fetch']
    for (const event of requiredEvents) {
      if (!swContent.includes(`addEventListener('${event}'`)) {
        console.error(`❌ Event listener '${event}' falta en service-worker.js`)
        allValid = false
      }
    }
  } catch (error) {
    console.error('❌ Error al leer service-worker.js:', error.message)
    allValid = false
  }

  if (allValid) {
    console.log('\n✅ ¡Configuración de PWA verificada correctamente!')
  } else {
    console.error('\n❌ Se encontraron problemas en la configuración de PWA')
    process.exit(1)
  }
}

verifyPWA().catch(error => {
  console.error('Error durante la verificación:', error)
  process.exit(1)
})
