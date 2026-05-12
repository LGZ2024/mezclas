/* eslint-disable no-undef */
import cron from 'node-cron'
import logger from '../utils/logger.js'
import { envs } from '../config/env.mjs'
import { ReporteFertilizacionService } from './reporte_fertilizacion.service.js'
import { Ranchos } from '../schema/ranchos.js'

export class SchedulerService {
    static init() {
        const cronJob = envs.CRON_JOB_VALIDACIONES_PROGRAMADAS
        logger.info('✅ Scheduler Service inicializado correctamente')
        logger.info(`⏰ Cron job configurado para ejecutarse cada ${cronJob === '*/5 * * * *' ? '5 minutos' : cronJob === '*/15 * * * *' ? '15 minutos' : cronJob === '* * * * *' ? '1 minuto' : cronJob}`)

        // Ejecutar cada 5 minutos (*/5 = cada 5, */15 = cada 15, * = cada 1)
        cron.schedule(cronJob, async () => {
            logger.info('🔄 Ejecutando verificación de validaciones programadas...')
            await this.procesarValidacionesProgramadas()
        })
        // Cron job mensual para reportes de fertilización (Día 1 de cada mes a las 08:00 AM)
        cron.schedule('0 8 1 * *', async () => {
            logger.info('📊 Iniciando generación de reportes mensuales de fertilización...')
            await this.generarYEnviarReportesMensuales()
        })
    }

    static async generarYEnviarReportesMensuales() {
        try {
            // Obtener el mes anterior (ya que el reporte se corre el día 1 del mes siguiente)
            const hoy = new Date()
            const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
            const mes = mesAnterior.getMonth() + 1 // 1-12
            const anio = mesAnterior.getFullYear()

            logger.info(`Generando reportes para Mes: ${mes}, Año: ${anio}`)

            // Obtener lista de ranchos activos (lo ideal es consultarlo de BD, pero usaré una lista quemada o consulta simple)
            // Importaremos el modelo de Ranchos si es necesario, por ahora simulo consulta o uso modelo
            // TODO: Importar RanchosModel
            const ranchos = await Ranchos.findAll({ where: { status: 1 } })

            for (const rancho of ranchos) {
                try {
                    logger.info(`Procesando rancho: ${rancho.rancho} (ID: ${rancho.id})`)
                    const htmlReport = await ReporteFertilizacionService.generarReporteMensual(rancho.id, mes, anio)

                    // Si no hay datos (retorna mensaje simple), tal vez no queramos enviar correo o sí para informar
                    if (htmlReport.includes('No se encontraron registros')) {
                        logger.info(`Sin datos para rancho ${rancho.rancho}, omitiendo envío.`)
                        continue
                    }

                    // Determinar destinatarios (usando lógica similar a notificaciones)
                    // Para reportes mensuales, enviamos a Admin y Mezcladores de ese rancho
                    const destinatarios = await NotificationService.determinarDestinatarios({
                        rancho: rancho.rancho,
                        empresa: rancho.nombre_empresa, // Necesitamos confirmar si tenemos este dato
                        user: { rol: 'system' } // Usuario sistema
                    })

                    if (destinatarios && destinatarios.length > 0) {
                        await NotificationService.enviarReporteMensual({
                            rancho: rancho.rancho,
                            htmlReport,
                            emails: destinatarios
                        })
                    } else {
                        logger.warn(`No se encontraron destinatarios para rancho ${rancho.rancho}`)
                    }
                } catch (errRancho) {
                    logger.error(`Error procesando reporte para rancho ${rancho.rancho}:`, errRancho)
                }
            }
            logger.info('✅ Generación de reportes mensuales completada')
        } catch (error) {
            logger.error('❌ Error general en cron de reportes mensuales:', error)
        }
    }
}
