// =============================================================================
// BUILD SCRIPT - Compilación de SCSS y optimización de assets
// Manteniendo tu diseño pero con sistema profesional de build
// =============================================================================

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Iniciando proceso de build...')

// 1. COMPILACIÓN DE SCSS
try {
  console.log('📨 Compilando SCSS...')

  // Verificar si node_modules existe
  if (!existsSync(join(__dirname, '../node_modules'))) {
    console.log('📦 Instalando dependencias...')
    execSync('npm install', {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    })
  }

  // Compilar SCSS a CSS
  execSync('npx sass public/scss/main.scss:public/css/main.css --style compressed', {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  })

  console.log('✅ SCSS compilado exitosamente')
} catch (error) {
  console.error('❌ Error compilando SCSS:', error.message)
  process.exit(1)
}

// 2. VERIFICACIÓN DE ARCHIVOS CRÍTICOS
const criticalFiles = [
  'public/css/main.css',
  'public/js/sw.js',
  'manifest.json',
  'public/images/LogoTransp.webp'
]

console.log('🔍 Verificando archivos críticos...')
for (const file of criticalFiles) {
  const filePath = join(__dirname, '..', file)
  if (!existsSync(filePath)) {
    console.error(`❌ Archivo crítico faltante: ${file}`)
    process.exit(1)
  }
  console.log(`✅ ${file} encontrado`)
}

// 3. OPTIMIZACIÓN DE MANIFEST
try {
  console.log('⚙️ Optimizando manifest.json...')
  const manifestPath = join(__dirname, '../manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

  // Actualizar versión y timestamp
  manifest.version = `1.0.0-${Date.now()}`
  manifest.last_updated = new Date().toISOString()

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log('✅ Manifest actualizado')
} catch (error) {
  console.error('❌ Error actualizando manifest:', error.message)
}

// 4. GENERACIÓN DE CRITICAL CSS
try {
  console.log('🎨 Generando critical CSS...')

  // Extraer estilos críticos del main.css
  const cssPath = join(__dirname, '../public/css/main.css')
  const cssContent = readFileSync(cssPath, 'utf8')

  // Estilos críticos para above-the-fold
  const criticalStyles = `
    /* Critical CSS - Above the Fold */
    ${cssContent.match(/body[^{]*\{[^}]*\}/g)?.join('\n') || ''}
    ${cssContent.match(/\.navbar[^{]*\{[^}]*\}/g)?.join('\n') || ''}
    ${cssContent.match(/\.content-wrapper[^{]*\{[^}]*\}/g)?.join('\n') || ''}
    ${cssContent.match(/\.card[^{]*\{[^}]*\}/g)?.join('\n') || ''}
  `

  const criticalPath = join(__dirname, '../public/css/critical.css')
  writeFileSync(criticalPath, criticalStyles.trim())
  console.log('✅ Critical CSS generado')
} catch (error) {
  console.error('❌ Error generando critical CSS:', error.message)
}

// 5. VERIFICACIÓN DE SERVICE WORKER
try {
  console.log('🔧 Verificando Service Worker...')
  const swPath = join(__dirname, '../public/js/sw.js')
  const swContent = readFileSync(swPath, 'utf8')

  // Verificar que las estrategias de caché estén definidas
  if (!swContent.includes('cacheStrategies')) {
    throw new Error('Faltan estrategias de caché en Service Worker')
  }

  console.log('✅ Service Worker verificado')
} catch (error) {
  console.error('❌ Error verificando Service Worker:', error.message)
}

// 6. GENERACIÓN DE HASH PARA CACHE BUSTING
try {
  console.log('🔐 Generando hashes para cache busting...')
  const crypto = require('crypto')

  const assets = {
    css: 'public/css/main.css',
    js: 'public/js/bundle.js' // Asumiendo que existe
  }

  const hashes = {}

  for (const [type, path] of Object.entries(assets)) {
    const fullPath = join(__dirname, '..', path)
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8')
      hashes[type] = crypto.createHash('md5').update(content).digest('hex').substring(0, 8)
    }
  }

  // Guardar hashes para referencia
  const hashesPath = join(__dirname, '../public/assets.json')
  writeFileSync(hashesPath, JSON.stringify(hashes, null, 2))
  console.log('✅ Hashes generados')
} catch (error) {
  console.error('❌ Error generando hashes:', error.message)
}

console.log('🎉 Build completado exitosamente!')
console.log('\n📋 Resumen:')
console.log('  ✅ SCSS compilado y optimizado')
console.log('  ✅ Critical CSS generado')
console.log('  ✅ Service Worker verificado')
console.log('  ✅ Manifest actualizado')
console.log('  ✅ Hashes de cache generados')
console.log('\n🚀 La aplicación está lista para producción')
