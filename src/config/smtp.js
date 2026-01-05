import { envs } from './env.mjs'
import nodemailer from 'nodemailer'
// utils
import logger from '../utils/logger.js'
import { ValidationError } from '../utils/CustomError.js'

// Configuración del transportador SMTP
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: 'portalrancho.com.mx',
    port: 465,
    secure: true,
    auth: {
      user: envs.EMAIL_USER,
      pass: envs.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2' // Versión mínima de TLS
    },
    pool: true,
    debug: true,
    logger: false
  })

  // Verificar conexión
  transporter.verify((error, success) => {
    if (error) {
      logger.error('Error en verificación SMTP:', error)
    } else {
      logger.info('Servidor SMTP listo')
    }
  })

  return transporter
}

// Función auxiliar para obtener color según el estatus
const getStatusColor = (status) => {
  const colors = {
    Proceso: '#28a745', // Verde
    Completada: '#ffc107', // Amarillo
    Rechazado: '#dc3545', // Rojo
    default: '#17a2b8' // Azul
  }
  return colors[status] || colors.default
}

// Función auxiliar para detalles adicionales según estatus
const getAdditionalDetails = (status) => {
  const details = {
    Proceso: '<p>Su solicitud está siendo procesada. Le mantendremos informado sobre cualquier actualización.</p>',
    Completada: '<p>Su solicitud ha sido <strong>completada</strong>. Para más detalles, por favor contacte a nuestro equipo.</p>',
    default: ''
  }
  return details[status] || details.default
}

// Función para enviar correo con manejo de errores
const sendMail = async (message) => {
  const transporter = createTransporter()

  try {
    const info = await transporter.sendMail(message)
    logger.info('Correo enviado:', {
      messageId: info.messageId,
      response: info.response
    })
    return info
  } catch (error) {
    logger.error('Error al enviar correo:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    })
    throw error
  }
}

const validateEmailData = (type, data) => {
  const requiredFields = {
    status: ['email', 'nombre', 'solicitudId', 'status'],
    solicitud: ['email', 'nombre', 'solicitudId', 'fechaSolicitud', 'usuario', 'data'],
    notificacion: ['email', 'nombre', 'solicitudId', 'data'],
    usuario: ['email', 'password'],
    respuestaSolicitante: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    cancelacion: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    aprobada: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    confirmacionInicial: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    devolucion: ['email', 'nombre', 'usuario', 'data']
  }

  const fields = requiredFields[type] || []
  const missing = fields.filter(field => !data[field])

  if (missing.length > 0) {
    throw new ValidationError(`Faltan campos requeridos para el tipo ${type}: ${missing.join(', ')}`)
  }
}
// Función principal para enviar correos
export const enviarCorreo = async (params) => {
  const {
    type,
    email,
    password = '',
    fechaSolicitud = '',
    nombre = 'Usuario',
    solicitudId = '',
    status = '',
    usuario = {},
    data = {}
  } = params
  // Definir constantes de desarrollo
  const DEV_EMAIL = 'zaragoza051@lgfrutas.com.mx'
  const PRODUCTION_MODE = 'Produccion'

  // Validar datos requeridos según el tipo
  validateEmailData(type, params)

  console.log(data)
  // Configurar mensaje según tipo
  if (!email || !type) {
    throw new ValidationError('Email y tipo de mensaje son requeridos')
  }

  // Configurar mensaje según tipo
  const templates = {
    status: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Actualización de Solicitud - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
             <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
                 <h1>Grupo LG</h1>
            </div>
            <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
                <h2>Actualización de Solicitud</h2>
                <p>Estimado(a) ${nombre},</p>
                <p>Le informamos que su solicitud con ID: <b>${solicitudId}</b> ha cambiado de estatus.</p>
                <div style="background-color: ${getStatusColor(status)}; color: white; padding: 10px; border-radius: 5px; text-align: center;">
                    <h3>Estado Actual: ${status}</h3>
                </div>
                <h4>Detalles de la Solicitud:</h4>
                ${getAdditionalDetails(status)}
      
               <a href="https://solicitudmezclas.portalrancho.com.mx/protected/${status}" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Ver Detalles de la Solicitud</a>
      
               <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
               <p>Atentamente,<br>El equipo de Grupo LG</p>
          </div>
      </body>`
    },
    usuario: {
      from: '"Registro Portal Checador" <mezclas.rancho@portalrancho.com.mx>',
      subject: 'Usuario Creado Exitosamente',
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
        <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
            <h1>Grupo LG</h1>
        </div>
        <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
            <h2>¡Bienvenido a Grupo LG!</h2>
            <p>Estimado nuevo usuario,</p>
            <p>Nos complace darte la bienvenida a Grupo LG. Tu cuenta ha sido creada exitosamente.</p>
            <p>Para acceder a tu cuenta, por favor utiliza los siguientes datos:</p>
            <ul>
                <li>Nombre de usuario:<b>${email}</b></li>
                <li>Contraseña temporal:<b>${password}</b></li>
            </ul>
             <a href="https://solicitudmezclas.portalrancho.com.mx/" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Iniciar Sesión</a>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
            <p>¡Gracias por unirte a nosotros!</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    solicitud: {
      from: '"Portal de Solicitudes Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Nueva Solicitud Creada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
            <h1>Grupo LG</h1>
        </div>
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
            <h2>Nueva Solicitud Creada</h2>
            <p>Estimado(a) ${nombre},</p>
            <p>Le informamos nueva solicitud ha sido creada con éxito. ID de solicitud es: <b>${solicitudId}</b>.</p>

            <h4>Datos de solicitante:</h4>
            <ul>
                <li><strong>Nombre:</strong> ${usuario.nombre}</li>
                <li><strong>Empresa</strong> ${usuario.empresa}</li>
                <li><strong>Rancho:</strong> ${data.rancho || data.ranchoDestino}</li>
            </ul>

            <h4>Detalles de la Solicitud:</h4>
            <ul>
                <li><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</li>
                <li><strong>Descripción:</strong> ${data.descripcion}</li>
                <li><strong>Folio Receta:</strong> ${data.folio}</li>
            </ul>

            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Detalles de la Solicitud</a>

            <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    notificacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Notificación de No Disponibilidad - ${solicitudId}`,
      html: ` <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
               <div style="background-color: #FF5733; color: white; text-align: center; padding: 20px;">
                   <h1>Grupo LG</h1>
               </div>
               <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
                   <h2>Notificación de No Disponibilidad de Producto</h2>
                   <p>Estimado(a) ${nombre},</p>
                   <p>Le informamos que el producto que solicitó no está disponible en este momento. A continuación, se detallan los datos de los productos sin existencia:</p>
      
                   <h4>Solicitud: <b>${solicitudId}</b></h4>
      
                   <ul>
                      ${Array.isArray(data)
          ? data.map(product => `
                   <li>
                     <strong>Id del Producto:</strong> ${product.id_producto}<br>
                     <strong>Nombre del Producto:</strong> ${product.nombre_producto}<br>
                     <strong>Unidad de Medida:</strong> ${product.unidad_medida}<br>
                     <strong>cantidad:</strong> ${product.cantidad}
                   </li>
                 `).join('')
          : '<li>No hay productos para mostrar</li>'}
                   </ul>
      
                   <p>Si desea, podemos ofrecerle alternativas similares o puede optar por omitir los productos. Por favor, háganos saber cómo desea proceder.</p>
                  <div style="text-align: center; margin-top: 20px;">
                      <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" 
                        style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Ver Solicitud
                      </a>
                  </div>
                   <p>Si tiene alguna pregunta o necesita más información, no dude en contactar a nuestro equipo de almacen.</p>
                   <p><strong>Encargado de almacen:</strong> ${usuario?.nombre || 'No especificado'}<br></p>
                   <p><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}<br></p>
                   <p><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}<br></p>
                   <p>Atentamente,<br>El equipo de Grupo LG</p>
               </div>
             </body>`
    },
    respuestaSolicitante: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Respuesta de Solicitante - Solicitud ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Respuesta de Solicitante</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Nueva Respuesta del Solicitante</h2>
          
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Ranchos:</strong> ${usuario?.ranchos || 'No especificado'}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Mensaje del Solicitante:</h4>
            <p style="margin-bottom: 0;">${data.mensaje}</p>
          </div>
  
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" 
               style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Ver Solicitud
            </a>
          </div>
  
          <p style="margin-top: 20px;">Por favor, revise la respuesta y tome las acciones necesarias.</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Este es un mensaje automático. Si necesita ayuda adicional, contacte al departamento de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    cancelacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Cancelada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc3545; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud Cancelada</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Cancelación de Solicitud</h2>
          
          <div style="background-color: #ffe6e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #dc3545;">Detalles de la Solicitud Cancelada:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Cancelación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <h4 style="margin-top: 0;">Motivo de Cancelación:</h4>
            <p style="margin-bottom: 0;">${data.motivo || 'No se especificó motivo'}</p>
          </div>
  
          <p style="margin-top: 20px;">Si considera que esto fue un error o necesita realizar una nueva solicitud, por favor:</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitud" 
               style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Crear Nueva Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si tiene alguna pregunta o necesita aclaraciones, no dude en contactar a nuestro equipo de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    aprobada: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Aprobada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #28a745; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud Aprobada</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>¡Su Solicitud ha sido Aprobada!</h2>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #28a745;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Aprobación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h4 style="margin-top: 0;">Información Importante:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Nota:</strong> La mezcla estará lista para su aprobacion en el almacén asignado.
          </p>

          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si tiene alguna pregunta o necesita aclaraciones, no dude en contactar a nuestro equipo de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    confirmacionInicial: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Pendiente de Confirmación - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Nueva Solicitud por Confirmar</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Nueva Solicitud Requiere Confirmación</h2>
          
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2196F3;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Información de la Mezcla:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio de Receta:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
              <li><strong>Descripción:</strong> ${data.descripcion || 'Sin descripción'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Acción Requerida:</strong> Esta solicitud necesita su confirmación para proceder con la preparación.
          </p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/confirmacion" 
               style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Revisar y Confirmar Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Este es un mensaje automático. Por favor, revise y confirme la solicitud lo antes posible.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    reevaluacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud en Reevaluación - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FFA500; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud en Reevaluación</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Solicitud Requiere Reevaluación</h2>
          
          <div style="background-color: #FFF3E0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #E65100;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Reevaluación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #FFA500; margin: 20px 0;">
            <h4 style="margin-top: 0;">Observaciones para Reevaluación:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Motivo:</strong> ${data.motivo || 'No especificado'}</li>
              <li><strong>Comentarios:</strong> ${data.comentarios || 'Sin comentarios adicionales'}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Detalles de la Mezcla:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio de Receta:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Acción Requerida:</strong> Por favor, revise los comentarios y realice las correcciones necesarias.
          </p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/reevaluacion/${solicitudId}" 
               style="display: inline-block; background-color: #FFA500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Revisar Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si necesita asistencia adicional, contacte al departamento de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    devolucion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Nueva Solicitud de Devolución - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
        <h1>Grupo LG - Nueva Devolución</h1>
      </div>
      
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
        <h2>Nueva Solicitud de Devolución de Productos</h2>
        
        <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #2196F3;">Información del Solicitante:</h4>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Solicitante:</strong> ${nombre}</li>
            <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
            <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
            <li><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>

        <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
          <h4 style="margin-top: 0;">Productos a Devolver:</h4>
          <div style="margin: 10px 0;">
            ${Array.isArray(data.productos)
          ? data.productos.map(producto => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <strong>Producto:</strong> ${producto.nombre}<br>
                  <strong>Cantidad:</strong> ${producto.cantidad} ${producto.unidad_medida}
                </div>
              `).join('')
          : '<p>No hay productos especificados</p>'
        }
          </div>
        </div>

        <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #FFA500; margin: 20px 0;">
          <h4 style="margin-top: 0;">Detalles Adicionales:</h4>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Almacén:</strong> ${data.almacen}</li>
            <li><strong>Temporada:</strong> ${data.temporada}</li>
            <li><strong>Descripción:</strong> ${data.descripcion || 'Sin descripción'}</li>
          </ul>
        </div>

        <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <strong>Acción Requerida:</strong> Por favor revise y procese esta solicitud de devolución.
        </p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://solicitudmezclas.portalrancho.com.mx/protected/devoluciones" 
             style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
             Gestionar Devolución
          </a>
        </div>

        <hr style="border: 1px solid #eee; margin: 20px 0;">
        
        <p style="color: #666; font-size: 0.9em;">
          Este es un mensaje automático. Por favor, procese la devolución lo antes posible.
        </p>
        
        <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
    </body>`
    }

  }

  try {
    const template = templates[type]
    if (!template) {
      throw new ValidationError(`Tipo de mensaje "${type}" no válido`)
    }

    logger.debug('Enviando correo con los siguientes datos:', {
      MODE: envs.MODE,
      type,
      to: envs.MODE !== PRODUCTION_MODE
        ? DEV_EMAIL
        : usuario?.email || DEV_EMAIL
    })
    // Configurar el mensaje
    const message = {
      ...template,
      to: envs.MODE !== PRODUCTION_MODE
        ? DEV_EMAIL
        : usuario?.email || DEV_EMAIL
    }

    const result = await sendMail(message)
    return {
      success: true,
      messageId: result.messageId
    }
  } catch (error) {
    logger.error('Error en enviarCorreo:', error)
    throw error
  }
}
