export default {
  development: {
    nodeVersion: '21.6.2',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: 'localhost'
    },
    build: {
      sourceMaps: false,
      minify: true,
      target: 'node24.0'
    }
  },
  production: {
    nodeVersion: '24.0.1',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || process.env.PLESK_PORT || 3000,
      HOST: '0.0.0.0'
    },
    build: {
      sourceMaps: false,
      minify: true,
      target: 'node24.0'
    }
  },
  common: {
    appName: 'mezclas-lg',
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
      dialect: 'mysql',
      logging: false
    }
  }
}
