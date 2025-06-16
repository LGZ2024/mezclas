import semver from 'semver'
import { envs } from '../src/config/env.mjs'

const requiredVersions = {
  development: '21.6.2',
  production: '24.0.1'
}

const checkNodeVersion = () => {
  const currentVersion = process.version
  const requiredVersion = requiredVersions[envs.MODE || 'development']

  console.log(requiredVersion)
  console.log(currentVersion)

  if (!semver.satisfies(currentVersion, `>=${requiredVersion}`)) {
    console.error(`Error: Se requiere Node.js ${requiredVersion} para ${envs.MODE}`)
    console.error(`Versión actual: ${currentVersion}`)
    process.exit(1)
  }
}

checkNodeVersion()
