import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const getDirname = (importMetaUrl) => dirname(fileURLToPath(importMetaUrl))
