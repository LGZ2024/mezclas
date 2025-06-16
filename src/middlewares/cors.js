import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost',
  'https://solicitudmezclas.portalrancho.com.mx',
  'https://mezclas.portalrancho.com.mx',
  'https://5xx636dm-3000.usw3.devtunnels.ms/'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
