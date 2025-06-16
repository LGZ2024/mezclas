import { promises as fs } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateTree (startPath, ignore = ['node_modules', '.git', '.next', 'dist']) {
  let result = ''

  async function buildTree (currentPath, prefix = '') {
    const items = await fs.readdir(currentPath)

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (ignore.includes(item)) continue

      const fullPath = path.join(currentPath, item)
      const isLast = i === items.length - 1
      const stats = await fs.stat(fullPath)
      const isDir = stats.isDirectory()

      result += `${prefix}${isLast ? '└───' : '├───'}${item}\n`

      if (isDir) {
        await buildTree(fullPath, prefix + (isLast ? '    ' : '│   '))
      }
    }
  }

  await buildTree(startPath)
  return result
}

try {
  const tree = await generateTree('.')
  await fs.writeFile('estructura.txt', tree)
  console.log('Estructura del directorio guardada en estructura.txt')
} catch (error) {
  console.error('Error:', error)
}
