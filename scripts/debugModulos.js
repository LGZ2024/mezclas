import sequelize from '../src/db/db.js'
import { Modulos } from '../src/schema/modulos.js'

const debugModulos = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexión a BD exitosa')

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        console.log('FK checks disabled')

        console.log('Dropping modulos...')
        await sequelize.query('DROP TABLE IF EXISTS modulos')

        console.log('Creating modulos via sync...')
        await Modulos.sync({ force: true })
        console.log('Modulos created!')

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        process.exit(0)
    } catch (error) {
        console.error('Error debugging modulos:', error)
        process.exit(1)
    }
}

debugModulos()
