import { ActivoMezcla } from '../src/schema/activo_mezcla.js'
import { Tanques } from '../src/schema/tanques.js'
import { Sectores } from '../src/schema/sectores.js'
import { MezclaCatalogo } from '../src/schema/mezclas_catalogo.js'
import { MezclaActivos } from '../src/schema/mezcla_activos.js'
import { Ranchos } from '../src/schema/ranchos.js'
import sequelize from '../src/db/db.js'
import { setupAssociations } from '../src/models/modelAssociations.js'

async function run() {
    try {
        console.log('Setting up associations...')
        setupAssociations()

        console.log('Running queries...')
        try {
            const [activos, tanques, sectores, mezclas, ranchosRes, anios] = await Promise.all([
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
            ]) // Removed catch here to let it fail if any query fails

            console.log('--- RESULTS ---')
            console.log(`Activos: ${activos.length}`)
            console.log(`Tanques: ${tanques.length}`)
            console.log(`Sectores: ${sectores.length}`)
            console.log(`Mezclas: ${mezclas.length}`)
            console.log(`Ranchos: ${ranchosRes.length}`)

            console.log('Anios type:', typeof anios)
            console.log('Anios isArray:', Array.isArray(anios))
            console.log('Anios length:', anios.length)
            if (Array.isArray(anios) && anios.length > 0) {
                console.log('Anios[0]:', anios[0])
            }

            console.log('Sectores length:', sectores.length)
            if (sectores.length > 0) {
                console.log('Sectores[0]:', JSON.stringify(sectores[0], null, 2))
                console.log('Sectores[0].sector:', sectores[0].sector)
                console.log('Sectores[0].sector_interno:', sectores[0].sector_interno)
            }
        } catch (innerError) {
            console.error('Error during query execution:', innerError)
        }
    } catch (error) {
        console.error('ERROR:', error)
    } finally {
        await sequelize.close()
    }
}

run()
