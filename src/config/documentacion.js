import swaggerJSDoc from 'swagger-jsdoc'
import { config } from 'dotenv'
config()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mezclas',
      version: '1.0.0',
      description: 'API para el sistema de mezclas',
      contact: {
        name: 'Soporte',
        email: 'soporte@example.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token no proporcionado o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No autorizado'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
}

export const swaggerSpec = swaggerJSDoc(options)
