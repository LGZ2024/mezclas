async function loadModule () {
  try {
    // Importa dinámicamente el módulo ES
    await import('./dist/bundle.mjs')
  } catch (error) {
    console.error('Error al cargar el módulo:', error)
  }
}

loadModule()
