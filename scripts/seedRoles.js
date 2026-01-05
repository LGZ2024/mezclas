import sequelize from '../src/db/db.js'
import { Roles } from '../src/schema/roles.js'
import { Permisos } from '../src/schema/permisos.js'
import { Modulos } from '../src/schema/modulos.js'
import { UsuariosRoles } from '../src/schema/usuarios_roles.js'
import { RolesPermisos } from '../src/schema/roles_permisos.js'
import { UsuariosAccesos } from '../src/schema/usuarios_accesos.js'
import { Usuario } from '../src/schema/usuarios.js'

const rolesToCreate = [
    { nombre: 'admin', descripcion: 'Administrador del sistema' },
    { nombre: 'mezclador', descripcion: 'Encargado de mezclas' },
    { nombre: 'solicita', descripcion: 'Usuario solicitante' },
    { nombre: 'solicita2', descripcion: 'Usuario solicitante nivel 2' },
    { nombre: 'supervisor', descripcion: 'Supervisor de área' },
    { nombre: 'administrativo', descripcion: 'Personal administrativo' },
    { nombre: 'adminMezclador', descripcion: 'Administrador de mezclas' },
    { nombre: 'Activos Fijos', descripcion: 'Encargado de activos fijos' }
]

const seedRoles = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexión a BD exitosa')

        // Desactivar FK checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

        // 1. Eliminar tablas dependientes para liberar FKs
        console.log('Eliminando tablas dependientes...')
        await UsuariosRoles.drop()
        await RolesPermisos.drop()
        await Permisos.drop() // Permisos depende de Modulos
        await UsuariosAccesos.drop()

        // 2. Sincronizar (recrear) tablas principales
        console.log('Sincronizando tablas principales...')
        await Roles.sync({ force: true })
        await Modulos.sync({ force: true })

        // 3. Recrear tablas dependientes
        console.log('Recreando tablas dependientes...')
        await Permisos.sync({ force: true })
        await RolesPermisos.sync({ force: true })
        await UsuariosRoles.sync({ force: true })
        await UsuariosAccesos.sync({ force: true })

        // 4. Actualizar tabla de usuarios (alter manual para evitar errores de validación en otros campos)
        console.log('Actualizando columna rol en Usuarios...')
        try {
            await sequelize.query("ALTER TABLE usuarios MODIFY COLUMN rol VARCHAR(255) NOT NULL")
        } catch (e) {
            console.warn('Advertencia al modificar columna rol (puede que ya sea varchar):', e.message)
        }

        // Reactivar FK checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

        console.log('Seeding roles...')
        for (const roleData of rolesToCreate) {
            const [role, created] = await Roles.findOrCreate({
                where: { nombre: roleData.nombre },
                defaults: roleData
            })
            if (created) {
                console.log(`Rol creado: ${role.nombre}`)
            } else {
                console.log(`Rol ya existe: ${role.nombre}`)
            }
        }

        console.log('Seeding completado')
        process.exit(0)
    } catch (error) {
        console.error('Error seeding roles:', error)
        process.exit(1)
    }
}

seedRoles()
