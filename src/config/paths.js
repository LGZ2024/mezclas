import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const paths = {
  root: join(__dirname, '..'),
  views: join(__dirname, '..', 'views'),
  public: join(__dirname, '..', '..', 'public'),
  uploads: join(__dirname, '..', 'uploads')
}
