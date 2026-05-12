import sequelize from '../src/db/db.js'
import { FertilizacionController } from '../src/controller/fertilizacion.controller.js'
import { setupAssociations } from '../src/models/modelAssociations.js'

// Mock request and response objects
const mockRes = () => {
    const res = {}
    res.json = (data) => { res.data = data; return res }
    res.status = (code) => { res.statusCode = code; return res }
    res.render = (view, data) => { res.view = view; res.data = data; return res }
    return res
}

const mockReq = (query = {}, body = {}, params = {}) => ({
    query,
    body,
    params,
    user: { id: 1, role: 'admin' },
    logger: { logOperation: () => { } }
})

const mockNext = (err) => {
    if (err) console.error('❌ Error capturado por Next:', err)
}

async function runValidation() {
    console.log('=== INICIANDO VALIDACIÓN DEL SISTEMA ===')

    try {
        // 1. SETUP & DB CONNECTION
        console.log('\n[1] Verificando conexión a base de datos...')
        await sequelize.authenticate()
        console.log('✅ Conexión establecida.')
        setupAssociations()
        console.log('✅ Asociaciones configuradas.')

        // 2. VERIFICAR VISTA CRÍTICA
        console.log('\n[2] Verificando existencia de vista/tabla npk_fertilizacion_completo...')
        try {
            const [results] = await sequelize.query('SELECT * FROM npk_fertilizacion_completo LIMIT 1')
            console.log('✅ Vista/Tabla npk_fertilizacion_completo existe y responde.')
        } catch (error) {
            console.error('❌ ERROR CRÍTICO: No se puede consultar npk_fertilizacion_completo.', error.message)
        }

        // 3. VERIFICAR CATALOGOS
        console.log('\n[3] Verificando endpoint getCatalogos...')
        const reqCat = mockReq()
        const resCat = mockRes()
        await FertilizacionController.getCatalogos(reqCat, resCat, mockNext)

        if (resCat.data && resCat.data.success) {
            const data = resCat.data.data
            console.log(`✅ Catalogos obtenidos:
                - Activos: ${data.activos.length}
                - Tanques: ${data.tanques.length}
                - Sectores: ${data.sectores.length}
                - Mezclas: ${data.mezclas.length}
                - Ranchos: ${data.ranchos.length}
                - Anios: ${data.anios.length} (Tipo: ${Array.isArray(data.anios) && !Array.isArray(data.anios[0]) ? 'Array plano OK' : 'INCORRECTO'})`)

            // Check Sectores structure
            if (data.sectores.length > 0) {
                const s = data.sectores[0]
                console.log(`   * Sector muestra: ID=${s.id}, Internal=${s.sector_interno}, Agrian=${s.sector_agrian}`)
            }
        } else {
            console.error('❌ Falló getCatalogos', resCat.data)
        }

        // 4. VERIFICAR REPORTE FERTILIZACION COMPLETO
        console.log('\n[4] Verificando reporteFertilizacionCompleto (Simulación)...')
        const reqRep = mockReq({ anio: 2026 })
        const resRep = mockRes()
        await FertilizacionController.reporteFertilizacionCompleto(reqRep, resRep, mockNext)

        if (resRep.data && resRep.data.success) {
            console.log(`✅ Reporte generado correctamente. Registros encontrados: ${resRep.data.data.length}`)
        } else {
            console.error('❌ Falló reporteFertilizacionCompleto', resRep.data)
        }

        // 5. VERIFICAR STORED PROCEDURES (Resumen Anual)
        console.log('\n[5] Verificando SP sp_resumen_anual...')
        const reqSP = mockReq({ anio: 2026 })
        const resSP = mockRes()
        await FertilizacionController.reporteResumenAnual(reqSP, resSP, mockNext)

        if (resSP.data && resSP.data.success) {
            console.log('✅ SP sp_resumen_anual ejecutado correctamente.')
            if (resSP.data.data.length > 0) {
                console.log('   Datos de resumen anual:', resSP.data.data[0])
            } else {
                console.log('   ⚠️ Resumen anual retornó 0 filas (puede ser normal si no hay datos)')
            }
        } else {
            console.error('❌ Falló reporteResumenAnual', resSP.data)
        }
    } catch (error) {
        console.error('\n❌ ERROR GENERAL EN VALIDACIÓN:', error)
    } finally {
        // await sequelize.close()
        console.log('\n=== VALIDACIÓN COMPLETADA ===')
        process.exit(0)
    }
}

await runValidation()
