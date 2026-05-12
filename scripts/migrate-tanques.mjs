import sequelize from '../src/db/db.js'

async function migrateTanques() {
    try {
        console.log('🔄 Iniciando migración de tanques a rancho_dsa...')

        // Paso 1: Agregar nueva columna
        console.log('📝 Paso 1: Agregando columna id_rancho_dsa...')
        await sequelize.query(`
            ALTER TABLE tanques 
            ADD COLUMN id_rancho_dsa INT NULL AFTER id_rancho
        `)
        console.log('✅ Columna id_rancho_dsa agregada')

        // Paso 2: Crear índice
        console.log('📝 Paso 2: Creando índice...')
        await sequelize.query(`
            CREATE INDEX idx_tanques_id_rancho_dsa ON tanques(id_rancho_dsa)
        `)
        console.log('✅ Índice creado')

        // Paso 3: Migrar datos existentes
        console.log('📝 Paso 3: Migrando datos existentes...')
        const [result] = await sequelize.query(`
            UPDATE tanques t 
            SET id_rancho_dsa = (
                SELECT rd.id 
                FROM rancho_dsa rd 
                WHERE rd.id_rancho = t.id_rancho 
                LIMIT 1
            )
            WHERE id_rancho_dsa IS NULL AND id_rancho IS NOT NULL
        `)
        console.log(`✅ Datos migrados: ${result.affectedRows} registros actualizados`)

        // Paso 4: Verificar migración
        console.log('📝 Paso 4: Verificando migración...')
        const [verification] = await sequelize.query(`
            SELECT 
                COUNT(*) as total_tanques,
                COUNT(CASE WHEN id_rancho_dsa IS NOT NULL THEN 1 END) as tanques_migrados,
                COUNT(CASE WHEN id_rancho_dsa IS NULL THEN 1 END) as tanques_sin_migrar
            FROM tanques
        `)

        console.log('📊 Resultados de la verificación:')
        console.log(`   Total tanques: ${verification[0].total_tanques}`)
        console.log(`   Tanques migrados: ${verification[0].tanques_migrados}`)
        console.log(`   Tanques sin migrar: ${verification[0].tanques_sin_migrar}`)

        if (verification[0].tanques_sin_migrar > 0) {
            console.log('⚠️  Hay tanques sin migrar. Esto puede ser normal si no tienen rancho_dsa correspondiente.')
        }

        console.log('🎉 Migración completada exitosamente!')
    } catch (error) {
        console.error('❌ Error durante la migración:', error)
        process.exit(1)
    } finally {
        await sequelize.close()
    }
}

migrateTanques()
