export default {
  openapi: '3.0.0',
  info: {
    title: 'API Mezclas',
    version: '1.0.0',
    description: 'Documentación de la API del sistema de mezclas'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    // Aquí van tus rutas
  }
}
