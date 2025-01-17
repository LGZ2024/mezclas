import { envs } from './env.mjs'
import nodemailer from 'nodemailer'

export const enviarCorreo = async ({ type, email, nombre, subject, password, solicitudId, fechaSolicitud, data, status, usuario }) => {
  let message
  // Configuración del transportador de email
  // Configuración del transporte
  const transporter = nodemailer.createTransport({
    host: 'portalrancho.com.mx', // Servidor de correo saliente
    port: 465, // Puerto SMTP (puedes cambiarlo si tienes bloqueos)
    secure: true, // Cambiar a true si usas un puerto con SSL/TLS
    auth: {
      user: envs.EMAIL_USER, // Usuario de correo
      pass: envs.EMAIL_PASSWORD // Contraseña del correo
    },
    tls: {
      rejectUnauthorized: false // Agrega esto si tienes problemas con certificados
    }
  })

  if (type === 'status') {
  // mensaje para status de solicitudes
    message = {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: 'zaragoza051@lgfrutas.com.mx',
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
  
          <a href="http://localhost:3000//protected/${status}" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Ver Detalles de la Solicitud</a>
          
          <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
          <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
  </body>`
    }
  } else if (type === 'usuario') {
  // mesaje de registro de usuarios
    message = {
      from: 'Registro Portal Checador',
      to: 'zaragoza051@lgfrutas.com.mx',
      subject,
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
          <p>Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
          <a href="http://localhost:3000/" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Iniciar Sesión</a>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
          <p>¡Gracias por unirte a nosotros!</p>
          <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
  </body>`
    }
  } else if (type === 'solicitud') {
    // Mensaje para la creación de solicitudes
    message = {
      from: '"Portal de Solicitudes Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: 'zaragoza051@lgfrutas.com.mx',
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
            <li><strong>Rancho:</strong> ${data.rancho}</li>
        </ul>

        <h4>Detalles de la Solicitud:</h4>
        <ul>
            <li><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</li>
            <li><strong>Descripción:</strong> ${data.descripcion}</li>
            <li><strong>Folio Receta:</strong> ${data.folio}</li>
        </ul>

        <a href="http://localhost:3000/protected/solicitudes" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Detalles de la Solicitud</a>
        
        <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
        <p>Atentamente,<br>El equipo de Grupo LG</p>
    </div>
</body>`
    }
  } else if (type === 'notificacion') {
    message = {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: 'zaragoza051@lgfrutas.com.mx', // Replace with the customer's email
      subject: `Notificación de No Disponibilidad - ${solicitudId}`,
      html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FF5733; color: white; text-align: center; padding: 20px;">
              <h1>Grupo LG</h1>
          </div>
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
              <h2>Notificación de No Disponibilidad de Producto</h2>
              <p>Estimado(a) ${nombre},</p>
              <p>Le informamos que el producto que solicitó no está disponible en este momento. A continuación, se detallan los datos de los productos sin existencia:</p>
              
              <h4>Solicitud: <b>${solicitudId}</b></h4>

              <ul>
                 ${data.map(product => `
              <li>
                <strong>Id del Producto:</strong> ${product.id_producto}<br>
                <strong>Nombre del Producto:</strong> ${product.nombre_producto}<br>
                <strong>Unidad de Medida:</strong> ${product.unidad_medida}<br>
                <strong>cantidad:</strong> ${product.cantidad}
              </li>
            `).join('')}
              </ul>
    
              <p>Si desea, podemos ofrecerle alternativas similares o puede optar por omitir los productos. Por favor, háganos saber cómo desea proceder.</p>
              
              <p>Si tiene alguna pregunta o necesita más información, no dude en contactar a nuestro equipo de almacen.</p>
              <p><strong>Encardado de almacen:</strong>${usuario.nombre}<br></p>
              <p><strong>Empresa:</strong>${usuario.empresa}<br></p>
              <p><strong>rancho:</strong>${usuario.ranchos}<br></p>
              <p>Atentamente,<br>El equipo de Grupo LG</p>
          </div>
        </body>`
    }
  }

  // Función auxiliar para obtener color según el estatus
  function getStatusColor (status) {
    switch (status) {
      case 'Proceso': return '#28a745' // Verde
      case 'Completada': return '#ffc107' // Amarillo
      case 'Rechazado': return '#dc3545' // Rojo
      default: return '#17a2b8' // Azul
    }
  }

  // Función auxiliar para agregar detalles adicionales según el estatus
  function getAdditionalDetails (status) {
    switch (status) {
      case 'Proceso':
        return '<p>Su solicitud está siendo procesada. Le mantendremos informado sobre cualquier actualización.</p>'
      case 'Completada':
        return '<p>Su solocitud a sido <strong>completada</strong>. Para más detalles, por favor contacte a nuestro equipo.</p>'
      default:
        return ''
    }
  }

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(`Error al enviar correo ${error}`)
    } else {
      console.log('Correo Enviado')
    }
  })
}
