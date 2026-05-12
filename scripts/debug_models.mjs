import sequelize from '../src/db/db.js'
import { ActivoMezcla } from '../src/schema/activo_mezcla.js'
import { Tanques } from '../src/schema/tanques.js'
import { Sectores } from '../src/schema/sectores.js'
import { MezclaCatalogo } from '../src/schema/mezclas_catalogo.js'
import { MezclaActivos } from '../src/schema/mezcla_activos.js'
import { Ranchos } from '../src/schema/ranchos.js'
import { setupAssociations } from '../src/models/modelAssociations.js'

async function runDebug() {
    console.log('=== DEBUG MODELOS COMPLETO ===')
    try {
        await sequelize.authenticate()
        console.log('✅ DB Connected')
        setupAssociations()
        console.log('✅ Associations setup')

        console.log('Running Promise.all simulation (mimics getCatalogos)...')
        const [activos, tanques, sectores, mezclas, ranchos, anios] = await Promise.all([
            ActivoMezcla.findAll(),
            Tanques.findAll({ where: { status: 1 } }),
            Sectores.findAll({
                where: { status: 1 },
                include: [
                    {
                        model: Ranchos,
                        attributes: ['id', 'rancho']
                    }
                ]
            }),
            MezclaCatalogo.findAll({
                include: [
                    { model: MezclaActivos, include: [ActivoMezcla] }
                ]
            }),
            Ranchos.findAll({ where: { status: 1 } }),
            sequelize.query(`
              SELECT anio FROM npk_fertilizacion_completo GROUP by anio
            `, { type: sequelize.QueryTypes.SELECT })
        ])
        console.log('✅ Promise.all OK')
        console.log(`- Activos: ${activos.length}`)
        console.log(`- Tanques: ${tanques.length}`)
        console.log(`- Sectores: ${sectores.length}`)
        console.log(`- Mezclas: ${mezclas.length}`)
        console.log(`- Ranchos: ${ranchos.length}`)
        console.log(`- Anios: ${anios.length}`)

        console.log('\nTesting SP sp_resumen_anual...')
        const resumen = await sequelize.query('CALL sp_resumen_anual(2026)', { type: sequelize.QueryTypes.RAW })
        console.log('✅ SP sp_resumen_anual OK')
        // raw query for stored procedure usually returns [results, metadata] or just results depending on driver.
        // Sequelize RAW usually returns [results, metadata].
        // But here we might check whatever is returned.
        console.log('Resumen executed.')
    } catch (error) {
        console.error('❌ ERROR:', error)
    } finally {
        process.exit(0)
    }
}

await runDebug()
