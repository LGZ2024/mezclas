import sequelize from '../db/db.js'
import ejs from 'ejs'
import logger from '../utils/logger.js'

export class ReporteFertilizacionService {
    /**
       * Genera el reporte mensual de fertilización para un rancho específico
       * @param {number} ranchoId - ID del rancho
       * @param {number} mes - Número de mes (1-12)
       * @param {number} anio - Año (ej. 2025)
       * @returns {string} - HTML del reporte (tabla)
       */
    static async generarReporteMensual(ranchoId, mes, anio) {
        try {
            // 1. Obtener datos detallados
            const data = await this.obtenerDatosReporte(ranchoId, mes, anio)

            if (!data || data.length === 0) {
                return '<p>No se encontraron registros de fertilización para este periodo.</p>'
            }

            // 2. Construir HTML
            const html = await this.construirTablaHTML(data)
            return html
        } catch (error) {
            logger.error('Error generando reporte mensual:', error)
            throw error
        }
    }

    static async obtenerDatosReporte(ranchoId, mes, anio) {
        // Consulta compleja para obtener el desglose por mezcla y activo
        // Se agrupa por sector, mezcla y activo para calcular totales
        const query = `
            SELECT 
                s.variedad AS cultivo,
                s.sector_interno AS sector,
                s.hectareas,
                m.nombre AS nombre_producto,
                m.fabricante,
                am.nombre AS nombre_activo,
                am.codigo AS composicion,
                ma.cantidad AS cantidad_por_mezcla, -- kg/L por tanque
                ma.unidad AS unidad_medida,
                at.volumen_por_tanque,
                COUNT(at.id) AS numero_preparaciones,
                SUM(at.tanques_aplicados) AS total_tanques,
                SUM(at.tanques_aplicados * ma.cantidad) AS cantidad_total_preparada_mes,
                SUM(at.tanques_aplicados * ma.cantidad) / s.hectareas AS dosis_por_hectarea
            FROM aplicaciones_tanque at
            JOIN sectores s ON at.id_sector = s.id
            JOIN mezclas m ON at.id_mezcla = m.id
            JOIN mezcla_activos ma ON m.id = ma.id_mezcla
            JOIN activo_mezcla am ON ma.id_activo = am.id
            WHERE 
                s.id_rancho = :ranchoId
                AND MONTH(at.fecha) = :mes
                AND YEAR(at.fecha) = :anio
            GROUP BY 
                s.id, m.id, am.id
            ORDER BY 
                s.variedad, s.sector_interno, m.nombre, am.codigo
        `

        const results = await sequelize.query(query, {
            replacements: { ranchoId, mes, anio },
            type: sequelize.QueryTypes.SELECT
        })

        return results
    }

    static async construirTablaHTML(data) {
        // Agrupar datos por Cultivo -> Sector -> Mezcla
        const grouped = {}

        data.forEach(row => {
            const sectorKey = `${row.cultivo} - ${row.sector} (${row.hectareas} ha)`
            if (!grouped[sectorKey]) grouped[sectorKey] = []
            grouped[sectorKey].push(row)
        })

        // Plantilla EJS inline para la tabla
        const template = `
            <% for (const [sector, items] of Object.entries(grouped)) { %>
                <div style="margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #6a1b9a; color: white; padding: 10px; font-weight: bold;">
                        SECTOR: <%= sector %>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif;">
                        <thead>
                            <tr style="background-color: #4a148c; color: white;">
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Producto</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Composición</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Cant. x Mezcla</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Unidad</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;"># Preparaciones</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Mes (Kg/L)</th>
                                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Dosis / Ha</th>
                            </tr>
                        </thead>
                        <tbody>
                            <% items.forEach((item, index) => { %>
                                <tr style="background-color: <%= index % 2 === 0 ? '#ffffff' : '#f3e5f5' %>;">
                                    <td style="padding: 8px; border: 1px solid #ddd;"><%= item.nombre_producto %></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><%= item.nombre_activo %> (<%= item.composicion %>)</td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><%= Number(item.cantidad_por_mezcla).toFixed(2) %></td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><%= item.unidad_medida %></td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><%= item.total_tanques %></td> <!-- Usamos total_tanques que es sum(tanques_aplicados) -->
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;"><%= Number(item.cantidad_total_preparada_mes).toFixed(2) %></td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #d81b60;"><%= Number(item.dosis_por_hectarea).toFixed(4) %></td>
                                </tr>
                            <% }); %>
                        </tbody>
                    </table>
                </div>
            <% } %>
        `

        return ejs.render(template, { grouped })
    }
}
