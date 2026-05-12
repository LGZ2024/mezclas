import { UsuarioModel } from '../models/usuario.models.js'
import { enviarCorreo } from '../config/smtp.js'
import { format } from 'date-fns'
import loggerWiston from '../utils/logger.js'

export class NotificationService {
    static async determinarDestinatarios({ rancho, empresa, user }) {
        let ress = []
        try {
            loggerWiston.debug('Determinando destinatarios de notificación iniciada')
            if (rancho === 'Atemajac') {
                if (user.rol === 'adminMezclador') {
                    const r1 = await UsuarioModel.getUserEmailRanchoRol({ rol: 'mezclador', rancho: 'Atemajac' })
                    ress = [...r1]
                } else {
                    const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' })
                    ress = [...r3]
                }
            } else if (rancho === 'Seccion 7 Fresas') {
                const r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'adminMezclador', empresa: 'Bioagricultura' })
                ress = [...r3]
            } else if (['Romero', 'Potrero', 'Casas de Altos', 'Santiaguillo', 'Rincon', 'Paraiso', 'Guzman', 'Chivas', 'Jimenez'].includes(rancho)) {
                let r3 = []
                r3 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
                ress = [...r3]
            } else if (['La Loma', 'Zapote', 'Ojo de Agua'].includes(rancho)) {
                const r1 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
                ress = [...r1]
            } else if (rancho === 'Ahualulco') {
                const r2 = await UsuarioModel.getUserEmailEmpresa({ rol: 'mezclador', empresa })
                ress = [...r2]
            } else {
                const r2 = await UsuarioModel.getOneId({ id: user.id }) // master
                ress = [...r2]
            }
            loggerWiston.debug('Determinando destinatarios de notificación finalizada', { count: ress.length })
            return ress
        } catch (error) {
            loggerWiston.error('Error al determinar destinatarios', { error: error.message })
            throw error
        }
    }

    static async enviarCorreoNotificacion({ ress, solicitud, user, requestData, logger = loggerWiston }) {
        logger.info('Enviando correo de notificación iniciado')

        // Función auxiliar para enviar un correo individual
        const enviarIndividual = async (usuario, type, dataEspecifica) => {
            logger.info(`Enviando a nombre:${usuario.nombre}, correo:${usuario.email}`)
            return await enviarCorreo({
                type,
                email: usuario.email,
                nombre: usuario.nombre,
                solicitudId: solicitud?.idSolicitud || solicitud.solicitud?.id || solicitud, // Intenta manejar diferentes estructuras
                fechaSolicitud: format(new Date(requestData?.fechaSolicitud || new Date()), 'dd/MM/yyyy HH:mm:ss'),
                data: dataEspecifica || requestData,
                usuario: {
                    nombre: user.nombre,
                    empresa: user.empresa,
                    ranchos: requestData.rancho || requestData?.ranchoDestino
                }
            })
        }

        if (user.rol === 'adminMezclador') {
            for (const usuario of ress) {
                await enviarIndividual(usuario, 'solicitud', requestData)
            }
        } else if (['Atemajac', 'Seccion 7 Fresas'].includes(requestData?.ranchoDestino || requestData.solicitud?.ranchoDestino)) {
            for (const usuario of ress) {
                // Datos específicos para confirmación inicial
                const dataConfirmacion = {
                    folio: requestData?.folio || requestData?.solicitud?.folio,
                    cantidad: requestData?.cantidad || requestData?.solicitud?.cantidad,
                    presentacion: requestData?.presentacion || requestData?.solicitud?.presentacion,
                    metodoAplicacion: requestData?.metodoAplicacion || requestData?.solicitud?.metodoAplicacion,
                    descripcion: requestData?.descripcion || requestData?.solicitud?.descripcion
                }
                await enviarIndividual(usuario, 'confirmacionInicial', dataConfirmacion)
            }
        } else {
            for (const usuario of ress) {
                await enviarIndividual(usuario, 'solicitud', requestData)
            }
        }
        logger.info('Proceso de envío de correos completado')
    }

    static async enviarReporteMensual({ rancho, htmlReport, emails }) {
        try {
            loggerWiston.info(`Enviando reporte mensual de fertilización para rancho: ${rancho}`)

            for (const email of emails) {
                await enviarCorreo({
                    type: 'reporteMensualFertilizacion',
                    email: email.email, // Asumiendo que el objeto tiene propiedad email
                    nombre: email.nombre || 'Usuario', // Asumiendo propiedad nombre
                    data: {
                        rancho,
                        mes: new Date().toLocaleString('es-MX', { month: 'long', year: 'numeric' }),
                        htmlContent: htmlReport
                    }
                })
            }
            loggerWiston.info(`Reporte mensual enviado a ${emails.length} destinatarios`)
        } catch (error) {
            loggerWiston.error('Error enviando reporte mensual:', error)
            throw error
        }
    }
}
