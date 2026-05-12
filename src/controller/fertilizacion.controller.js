/* eslint-disable camelcase */
import { ActivoMezcla } from '../schema/activo_mezcla.js'
import { Tanques } from '../schema/tanques.js'
import { Sectores } from '../schema/sectores.js'
import { MezclaCatalogo } from '../schema/mezclas_catalogo.js'
import { MezclaActivos } from '../schema/mezcla_activos.js'
import { AplicacionesTanque } from '../schema/aplicaciones_tanque.js'
import { Ranchos } from '../schema/ranchos.js'
import { RanchoDsa } from '../schema/rancho_dsa.js'
import { TanquesPreparados } from '../schema/tanques_preparados.js'
import { MezclasTanque } from '../schema/mezclas_tanque.js'
import ExcelJS from 'exceljs'

// DB
import sequelize from '../db/db.js'
import { Op } from 'sequelize'

// Utils
import { withTransaction, withDatabaseQuery } from '../utils/transactionUtils.js'
import { validateRequiredData } from '../utils/errorHandlers.js'
import { BusinessError, NotFoundError, ValidationError } from '../utils/CustomError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export class FertilizacionController {
    static getCatalogos = asyncHandler(async (req, res) => {
        const logger = req.logger
        const catalogos = await withDatabaseQuery(
            async () => {
                const [activos, tanques, sectores, mezclas, ranchos, ranchos_dsa, temporadas] = await Promise.all([
                    ActivoMezcla.findAll(),
                    Tanques.findAll({
                        where: { status: 1 },
                        include: [
                            {
                                model: Ranchos,
                                attributes: ['id', 'rancho']
                            }
                        ]
                    }),
                    Sectores.findAll({
                        where: { status: 1 },
                        include: [
                            {
                                model: RanchoDsa,
                                attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
                                include: [
                                    {
                                        model: Ranchos,
                                        attributes: ['id', 'rancho']
                                    }
                                ]
                            }
                        ]
                    }),
                    MezclaCatalogo.findAll({
                        include: [
                            { model: MezclaActivos, include: [ActivoMezcla] }
                        ]
                    }),
                    Ranchos.findAll({ where: { status: 1 } }),
                    RanchoDsa.findAll({ where: { status: 1 } }),
                    sequelize.query(`
                    SELECT anio FROM npk_fertilizacion_completo GROUP by anio
                    `, { type: sequelize.QueryTypes.SELECT }),
                    sequelize.query(`
                    SELECT temporada FROM temporada WHERE status=1`,
                        { type: sequelize.QueryTypes.SELECT })
                ])

                return { activos, tanques, sectores, mezclas, ranchos, ranchos_dsa, anios: [], temporadas }
            },
            { operation: 'GET_CATALOGOS', userId: req.user?.id }
        )

        logger.logOperation('GET_CATALOGOS', 'success', {
            activosCount: catalogos.activos.length,
            tanquesCount: catalogos.tanques.length,
            sectoresCount: catalogos.sectores.length,
            mezclasCount: catalogos.mezclas.length,
            ranchosCount: catalogos.ranchos.length,
            anios: catalogos.anios.length,
            temporadas: catalogos.temporadas.length
        })

        res.json({
            success: true,
            data: catalogos
        })
    })

    // ========== RENDERIZAR PÁGINAS ==========
    static renderMezclas = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/mezclas', {
            title: 'Catálogo de Mezclas',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderGraficas = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/graficas', {
            title: 'Reportes de Fertilización',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderRegistro = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/nueva_estructura_registro', {
            title: 'Registro de Aplicación',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderNuevaEstructuraRegistro = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/nueva_estructura_registro', {
            title: 'Registro de Fertilización - Nueva Estructura',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderNuevaEstructuraReportes = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/nueva_estructura_reportes', {
            title: 'Reportes V2 - Nueva Estructura',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderPrepararTanque = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/preparar_tanque', {
            title: 'Preparar Tanque',
            user: req.user,
            rol: req.user.rol
        })
    })

    // ========== GESTIÓN DE MEZCLAS CATÁLOGO ==========
    static crearMezcla = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { nombre, fabricante, descripcion } = req.body

        validateRequiredData(req.body, ['nombre', 'fabricante'], {
            operation: 'CREATE_MEZCLA'
        })

        const nuevaMezcla = await withTransaction(
            async (transaction) => {
                const mezcla = await MezclaCatalogo.create({
                    nombre: nombre.trim(),
                    fabricante: fabricante.trim(),
                    descripcion: descripcion ? descripcion.trim() : null
                }, { transaction })

                logger.logOperation('CREATE_MEZCLA', 'success', {
                    mezclaId: mezcla.id,
                    nombre: mezcla.nombre
                })

                return mezcla
            },
            { operation: 'CREATE_MEZCLA', userId: req.user?.id }
        )

        res.status(201).json({
            success: true,
            message: 'Mezcla creada correctamente',
            data: nuevaMezcla
        })
    })

    static actualizarMezcla = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { id } = req.params
        const { nombre, fabricante, descripcion } = req.body

        validateRequiredData(req.body, ['nombre', 'fabricante'], {
            operation: 'UPDATE_MEZCLA'
        })

        const mezclaActualizada = await withTransaction(
            async (transaction) => {
                const mezcla = await MezclaCatalogo.findByPk(id, { transaction })
                if (!mezcla) {
                    throw new NotFoundError('Mezcla no encontrada', { mezclaId: id })
                }

                await mezcla.update(
                    { nombre, fabricante, descripcion },
                    { transaction }
                )

                logger.logOperation('UPDATE_MEZCLA', 'success', {
                    mezclaId: mezcla.id,
                    nombre: mezcla.nombre
                })

                return mezcla
            },
            { operation: 'UPDATE_MEZCLA', mezclaId: id, userId: req.user?.id }
        )

        res.json({
            success: true,
            message: 'Mezcla actualizada correctamente',
            data: mezclaActualizada
        })
    })

    static eliminarMezcla = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { id } = req.params

        await withTransaction(
            async (transaction) => {
                const mezcla = await MezclaCatalogo.findByPk(id, { transaction })
                if (!mezcla) {
                    throw new NotFoundError('Mezcla no encontrada', { mezclaId: id })
                }

                // Eliminar los activos asociados a la mezcla
                await MezclaActivos.destroy({ where: { id_mezcla: id }, transaction })

                // Eliminar la mezcla
                await mezcla.destroy({ transaction })

                logger.logOperation('DELETE_MEZCLA', 'success', {
                    mezclaId: id,
                    userId: req.user?.id
                })
            },
            { operation: 'DELETE_MEZCLA', mezclaId: id, userId: req.user?.id }
        )

        res.json({
            success: true,
            message: 'Mezcla eliminada correctamente'
        })
    })

    static obtenerMezclas = asyncHandler(async (req, res) => {
        const mezclas = await withDatabaseQuery(
            () => MezclaCatalogo.findAll({
                include: [
                    { model: MezclaActivos, include: [ActivoMezcla] }
                ]
            }),
            { operation: 'GET_MEZCLAS', userId: req.user?.id }
        )
        res.json({ success: true, data: mezclas })
    })

    static obtenerMezclaPorId = asyncHandler(async (req, res) => {
        const { id } = req.params
        const mezcla = await withDatabaseQuery(
            () => MezclaCatalogo.findByPk(id, {
                include: [
                    { model: MezclaActivos, include: [ActivoMezcla] }
                ]
            }),
            { operation: 'GET_MEZCLA_BY_ID', userId: req.user?.id, mezclaId: id }
        )

        if (!mezcla) {
            throw new NotFoundError('Mezcla no encontrada', { id })
        }

        res.json({ success: true, data: mezcla })
    })

    // ========== ASIGNACIÓN DE ACTIVOS A MEZCLAS ==========
    static asignarActivosMezcla = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { id_mezcla } = req.params
        const { activos } = req.body

        validateRequiredData(
            { id_mezcla, activos },
            ['id_mezcla', 'activos'],
            { operation: 'ASSIGN_MEZCLA_ACTIVOS' }
        )

        if (!Array.isArray(activos) || activos.length === 0) {
            throw new ValidationError('Debe proporcionar al menos un activo', {
                field: 'activos'
            })
        }

        const nuevosActivos = await withTransaction(
            async (transaction) => {
                const mezcla = await MezclaCatalogo.findByPk(id_mezcla, { transaction })
                if (!mezcla) {
                    throw new NotFoundError('Mezcla no encontrada', { mezclaId: id_mezcla })
                }

                await MezclaActivos.destroy(
                    { where: { id_mezcla } },
                    { transaction }
                )

                const nuevos = await MezclaActivos.bulkCreate(
                    activos.map(a => ({
                        id_mezcla,
                        id_activo: a.id_activo,
                        porcentaje: a.porcentaje || a.cantidad // Fallback for transition
                    })),
                    { transaction }
                )

                logger.logOperation('ASSIGN_MEZCLA_ACTIVOS', 'success', {
                    mezclaId: id_mezcla,
                    activosCount: nuevos.length
                })

                return nuevos
            },
            { operation: 'ASSIGN_MEZCLA_ACTIVOS', mezclaId: id_mezcla, userId: req.user?.id }
        )

        res.json({
            success: true,
            message: 'Ingredientes asignados a la mezcla',
            data: nuevosActivos
        })
    })

    static actualizarActivosMezcla = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { id_mezcla } = req.params
        const { activos } = req.body

        validateRequiredData(
            { id_mezcla, activos },
            ['id_mezcla', 'activos'],
            { operation: 'UPDATE_MEZCLA_ACTIVOS' }
        )

        if (!Array.isArray(activos) || activos.length === 0) {
            throw new ValidationError('Debe proporcionar al menos un activo', {
                field: 'activos'
            })
        }

        const nuevosActivos = await withTransaction(
            async (transaction) => {
                const mezcla = await MezclaCatalogo.findByPk(id_mezcla, { transaction })
                if (!mezcla) {
                    throw new NotFoundError('Mezcla no encontrada', { mezclaId: id_mezcla })
                }

                await MezclaActivos.destroy(
                    { where: { id_mezcla } },
                    { transaction }
                )

                const nuevos = await MezclaActivos.bulkCreate(
                    activos.map(a => ({
                        id_mezcla,
                        id_activo: a.id_activo,
                        porcentaje: a.porcentaje || a.cantidad
                    })),
                    { transaction }
                )

                logger.logOperation('UPDATE_MEZCLA_ACTIVOS', 'success', {
                    mezclaId: id_mezcla,
                    activosCount: nuevos.length
                })

                return nuevos
            },
            { operation: 'UPDATE_MEZCLA_ACTIVOS', mezclaId: id_mezcla, userId: req.user?.id }
        )

        res.json({
            success: true,
            message: 'Receta actualizada correctamente',
            data: nuevosActivos
        })
    })

    static obtenerActivosMezcla = asyncHandler(async (req, res) => {
        const { id_mezcla } = req.params

        const mezcla = await withDatabaseQuery(
            () => MezclaCatalogo.findByPk(id_mezcla, {
                include: [
                    { model: MezclaActivos, include: [ActivoMezcla] }
                ]
            }),
            { operation: 'GET_MEZCLA_ACTIVOS', mezclaId: id_mezcla, userId: req.user?.id }
        )

        if (!mezcla) {
            throw new NotFoundError('Mezcla no encontrada', { id_mezcla })
        }

        res.json({ success: true, data: mezcla })
    })

    // ========== PREPARACIÓN DE TANQUES EN CAMPO ==========
    static crearTanquePreparado = asyncHandler(async (req, res) => {
        const logger = req.logger
        const { id_tanque, mezclas, fecha_preparacion, litros_totales, id_rancho, codigo_tanque_preparado, tasa_inyeccion } = req.body

        validateRequiredData(
            { id_tanque, mezclas, fecha_preparacion, litros_totales, id_rancho, tasa_inyeccion },
            ['id_tanque', 'mezclas', 'fecha_preparacion', 'litros_totales', 'id_rancho', 'tasa_inyeccion'],
            { operation: 'CREATE_TANQUE_PREPARADO' }
        )

        if (!Array.isArray(mezclas) || mezclas.length === 0) {
            throw new ValidationError('Debe especificar al menos una mezcla', { field: 'mezclas' })
        }

        const nuevaTanquePreparado = await withTransaction(
            async (transaction) => {
                const creado = await TanquesPreparados.create({
                    id_tanque,
                    id_rancho,
                    fecha_preparacion,
                    litros_totales,
                    litros_disponibles: litros_totales,
                    codigo_tanque_preparado: codigo_tanque_preparado || null,
                    tasa_inyeccion: tasa_inyeccion || 0
                }, { transaction })

                const mezclasData = mezclas.map(m => ({
                    id_tanque_preparado: creado.id,
                    id_mezcla: m.id_mezcla,
                    cantidad_litros: m.cantidad_litros
                }))

                await MezclasTanque.bulkCreate(mezclasData, { transaction })

                logger.logOperation('CREATE_TANQUE_PREPARADO', 'success', {
                    tanqueId: id_tanque,
                    tanquePreparadoId: creado.id,
                    mezclasCount: mezclas.length,
                    litrosTotales: litros_totales,
                    ranchoId: id_rancho
                })

                return creado
            },
            { operation: 'CREATE_TANQUE_PREPARADO', userId: req.user?.id }
        )

        res.status(201).json({
            success: true,
            message: 'Tanque preparado registrado',
            data: nuevaTanquePreparado
        })
    })

    static getTanquesPreparados = asyncHandler(async (req, res) => {
        const tanques = await withDatabaseQuery(
            async () => {
                return TanquesPreparados.findAll({
                    where: {
                        litros_disponibles: { [Op.gt]: 0 }
                    },
                    include: [
                        {
                            model: MezclasTanque,
                            include: [{ model: MezclaCatalogo, attributes: ['nombre'] }]
                        },
                        { model: Tanques, attributes: ['codigo', 'etapa'] },
                        { model: Ranchos, attributes: ['rancho'] }
                    ],
                    order: [['fecha_preparacion', 'DESC']]
                })
            },
            { operation: 'GET_TANQUES_PREPARADOS', userId: req.user?.id }
        )
        res.json({ success: true, data: tanques })
    })

    static getTanquesPreparadosPorRancho = asyncHandler(async (req, res) => {
        const { id_rancho } = req.params
        const tanques = await withDatabaseQuery(
            async () => {
                return TanquesPreparados.findAll({
                    where: {
                        id_rancho,
                        litros_disponibles: { [Op.gt]: 0 }
                    },
                    include: [
                        {
                            model: MezclasTanque,
                            include: [{ model: MezclaCatalogo, attributes: ['nombre'] }]
                        },
                        { model: Tanques, attributes: ['codigo', 'etapa'] },
                        { model: Ranchos, attributes: ['rancho'] }
                    ],
                    order: [['fecha_preparacion', 'DESC']]
                })
            },
            { operation: 'GET_TANQUES_PREPARADOS_POR_RANCHO', userId: req.user?.id }
        )
        res.json({ success: true, data: tanques })
    })

    static getDetalleTanque = asyncHandler(async (req, res) => {
        const { id } = req.params
        const logger = req.logger
        const logContext = { operation: 'GET_DETALLE_TANQUE', userId: req.user?.id }
        logger.info('Obteniendo detalle del tanque', logContext)
        const tanque = await withDatabaseQuery(
            () => TanquesPreparados.findByPk(id, {
                include: [
                    {
                        model: MezclasTanque,
                        attributes: ['cantidad_litros'],
                        include: [
                            {
                                model: MezclaCatalogo,
                                attributes: ['nombre', 'fabricante'],
                                include: [
                                    {
                                        model: MezclaActivos,
                                        include: [{ model: ActivoMezcla }]
                                    }
                                ]
                            }
                        ]
                    },
                    { model: Tanques },
                    {
                        model: Ranchos,
                        include: [{ model: RanchoDsa }]
                    }
                ]
            }),
            { operation: 'GET_DETALLE_TANQUE', userId: req.user?.id, tanqueId: id }
        )

        logger.info('Detalle del tanque obtenido', { ...logContext, tanqueId: id })

        if (!tanque) throw new NotFoundError('Tanque preparado no encontrado', { id })

        res.json({
            success: true,
            message: 'Detalle de tanque obtenido',
            data: tanque
        })
    })

    static registrarAplicacion = asyncHandler(async (req, res) => {
        const { id_tanque_preparado, id_sector, litros_aplicados, fecha, id_responsable } = req.body

        validateRequiredData(
            { id_tanque_preparado, id_sector, litros_aplicados, fecha, id_responsable },
            ['id_tanque_preparado', 'id_sector', 'litros_aplicados', 'fecha', 'id_responsable'],
            { operation: 'REGISTER_APLICACION_TANQUE' }
        )

        const resultado = await withTransaction(
            async (transaction) => {
                const tanque = await TanquesPreparados.findByPk(id_tanque_preparado, { transaction })
                if (!tanque) throw new NotFoundError('Tanque no encontrado', { id_tanque_preparado })

                const disponibles = parseFloat(tanque.litros_disponibles)
                const aplicados = parseFloat(litros_aplicados)

                if (Number.isNaN(disponibles) || Number.isNaN(aplicados)) {
                    throw new ValidationError('Valores numéricos inválidos', {
                        litros_disponibles: tanque.litros_disponibles,
                        litros_aplicados
                    })
                }

                if (disponibles < aplicados) {
                    throw new BusinessError(`Volumen insuficiente. Disponible: ${tanque.litros_disponibles}L`, {
                        disponibles: tanque.litros_disponibles,
                        solicitados: litros_aplicados
                    })
                }

                const sector = await Sectores.findByPk(id_sector, { transaction })
                if (!sector) throw new NotFoundError('Sector no encontrado', { id_sector })

                const nuevaAplicacion = await AplicacionesTanque.create({
                    id_sector,
                    id_tanque_preparado,
                    id_responsable,
                    fecha,
                    litros_aplicados
                }, { transaction })

                const nuevosDisponibles = disponibles - aplicados
                await tanque.update({ litros_disponibles: nuevosDisponibles }, { transaction })

                return { nuevaAplicacion, nuevosDisponibles }
            },
            { operation: 'REGISTER_APLICACION_TANQUE', userId: req.user?.id }
        )

        res.status(201).json({
            success: true,
            message: 'Aplicación registrada correctamente',
            data: {
                ...resultado.nuevaAplicacion.toJSON(),
                litros_restantes: resultado.nuevosDisponibles
            }
        })
    })

    // ========== REPORTES - VISTAS ==========
    static renderReportes = asyncHandler(async (req, res) => {
        res.render('pages/fertilizacion/reportes', {
            title: 'Reportes de Fertilización',
            user: req.user,
            rol: req.user.rol
        })
    })

    static reporteInventario = asyncHandler(async (req, res) => {
        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_inventario_tanques()',
                { type: sequelize.QueryTypes.RAW }
            ),
            { operation: 'GET_REPORTE_INVENTARIO', userId: req.user?.id }
        )

        res.json({
            success: true,
            message: 'Reporte de inventario generado',
            data: results[0]
        })
    })

    static reporteResumenAnual = asyncHandler(async (req, res) => {
        const { anio } = req.query
        validateRequiredData(req.query, ['anio'], { operation: 'REPORTE_RESUMEN_ANUAL' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_resumen_anual(?)',
                {
                    replacements: [parseInt(anio)],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_RESUMEN_ANUAL', userId: req.user?.id, anio }
        )

        res.json({
            success: true,
            message: 'Reporte resumen anual generado',
            data: results[0]
        })
    })

    static reportePorVariedad = asyncHandler(async (req, res) => {
        const { anio, mes } = req.query
        validateRequiredData(req.query, ['anio', 'mes'], { operation: 'REPORTE_POR_VARIEDAD' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_reporte_por_variedad(?, ?)',
                {
                    replacements: [parseInt(anio), parseInt(mes)],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_POR_VARIEDAD', userId: req.user?.id, anio, mes }
        )

        res.json({
            success: true,
            message: 'Reporte por variedad generado',
            data: results[0]
        })
    })

    static reporteMensualRancho = asyncHandler(async (req, res) => {
        const { anio, mes, id_rancho } = req.query
        validateRequiredData(req.query, ['anio', 'mes', 'id_rancho'], { operation: 'REPORTE_MENSUAL_RANCHO' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_reporte_mensual_rancho(?, ?, ?)',
                {
                    replacements: [parseInt(anio), parseInt(mes), parseInt(id_rancho)],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_MENSUAL_RANCHO', userId: req.user?.id, anio, mes, id_rancho }
        )

        res.json({
            success: true,
            message: 'Reporte mensual por rancho obtenido',
            data: results[0]
        })
    })

    static reporteComparativoMensual = asyncHandler(async (req, res) => {
        const { anio, id_rancho } = req.query
        validateRequiredData(req.query, ['anio'], { operation: 'REPORTE_COMPARATIVO_MENSUAL' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_comparativo_mensual(?, ?)',
                {
                    replacements: [parseInt(anio), id_rancho ? parseInt(id_rancho) : null],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_COMPARATIVO_MENSUAL', userId: req.user?.id, anio, id_rancho }
        )

        res.json({
            success: true,
            message: 'Reporte comparativo mensual obtenido',
            data: results[0]
        })
    })

    static reporteTopSectores = asyncHandler(async (req, res) => {
        const { anio, mes, limite } = req.query
        validateRequiredData(req.query, ['anio', 'mes'], { operation: 'REPORTE_TOP_SECTORES' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_top_sectores(?, ?, ?)',
                {
                    replacements: [parseInt(anio), parseInt(mes), limite ? parseInt(limite) : 10],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_TOP_SECTORES', userId: req.user?.id, anio, mes, limite }
        )

        res.json({
            success: true,
            message: 'Top sectores obtenido',
            data: results[0]
        })
    })

    static registrarFertilizacion = asyncHandler(async (req, res) => {
        const { id_sector, id_tanque_preparado, litros_aplicados, observaciones, temporada } = req.body

        validateRequiredData(
            { id_sector, id_tanque_preparado, litros_aplicados, temporada },
            ['id_sector', 'id_tanque_preparado', 'litros_aplicados', 'temporada'],
            { operation: 'CREATE_FERTILIZACION' }
        )

        const fertilizacion = await withTransaction(
            async (transaction) => {
                const idResponsable = req.user?.id
                if (!idResponsable) {
                    throw new ValidationError('Usuario no autenticado', { field: 'user.id' })
                }

                await sequelize.query('SET @p_id_fertilizacion = 0', {
                    transaction,
                    type: sequelize.QueryTypes.RAW
                })

                await sequelize.query(
                    'CALL sp_crear_fertilizacion(?, ?, ?, ?, ?, @p_id_fertilizacion, ?)',
                    {
                        replacements: [
                            id_sector,
                            idResponsable,
                            id_tanque_preparado,
                            litros_aplicados,
                            observaciones || null,
                            temporada
                        ],
                        transaction,
                        type: sequelize.QueryTypes.RAW
                    }
                )

                const [outRow] = await sequelize.query('SELECT @p_id_fertilizacion AS id', {
                    transaction,
                    type: sequelize.QueryTypes.SELECT
                })

                if (!outRow?.id) {
                    throw new BusinessError('No se pudo obtener el ID de la fertilización generada', {
                        id_sector,
                        id_tanque_preparado
                    })
                }

                return {
                    id: outRow.id,
                    id_sector,
                    id_responsable: idResponsable,
                    id_tanque_preparado,
                    litros_aplicados,
                    observaciones: observaciones || null,
                    temporada
                }
            },
            { operation: 'CREATE_FERTILIZACION', userId: req.user?.id, id_sector }
        )

        res.status(201).json({
            success: true,
            message: 'Fertilización registrada exitosamente',
            data: fertilizacion
        })
    })

    static registrarFertilizacionBulk = asyncHandler(async (req, res) => {
        const { sectores, id_tanque_preparado, horas_aplicadas, observaciones, temporada } = req.body

        validateRequiredData(
            { sectores, id_tanque_preparado, horas_aplicadas, temporada },
            ['sectores', 'id_tanque_preparado', 'horas_aplicadas', 'temporada'],
            { operation: 'CREATE_FERTILIZACION_BULK' }
        )

        if (!Array.isArray(sectores) || sectores.length === 0) {
            throw new ValidationError('Debe especificar al menos un sector', { field: 'sectores' })
        }

        const idsCreados = await withTransaction(
            async (transaction) => {
                const idResponsable = req.user?.id
                if (!idResponsable) {
                    throw new ValidationError('Usuario no autenticado', { field: 'user.id' })
                }

                // 1. Obtener información del tanque
                const tanque = await TanquesPreparados.findByPk(id_tanque_preparado, { transaction })
                if (!tanque) throw new NotFoundError('Tanque preparado no encontrado', { id_tanque_preparado })

                const tasa = parseFloat(tanque.tasa_inyeccion || 0)
                const litrosTotales = parseFloat(horas_aplicadas) * tasa

                if (parseFloat(tanque.litros_disponibles) < (litrosTotales - 0.01)) {
                    throw new BusinessError(`Volumen insuficiente en el tanque. Disponible: ${tanque.litros_disponibles}L, Requerido: ${litrosTotales.toFixed(2)}L`)
                }

                // 2. Obtener hectáreas de los sectores para distribución proporcional
                const sectoresData = await Sectores.findAll({
                    where: { id: sectores },
                    attributes: ['id', 'hectareas'],
                    transaction
                })

                if (sectoresData.length === 0) {
                    throw new NotFoundError('No se encontraron los sectores seleccionados')
                }

                const hectareasTotales = sectoresData.reduce((sum, s) => sum + parseFloat(s.hectareas || 0), 0)
                if (hectareasTotales <= 0) {
                    throw new BusinessError('La suma de las hectáreas de los sectores seleccionados debe ser mayor a cero')
                }

                const createdIds = []

                // 3. Registrar fertilización para cada sector
                for (const sector of sectoresData) {
                    const haSector = parseFloat(sector.hectareas || 0)
                    const litrosProporcionales = (haSector / hectareasTotales) * litrosTotales

                    // Llamar al SP para cada sector
                    await sequelize.query('SET @p_id_fertilizacion = 0', { transaction, type: sequelize.QueryTypes.RAW })

                    await sequelize.query(
                        'CALL sp_crear_fertilizacion(?, ?, ?, ?, ?, @p_id_fertilizacion, ?)',
                        {
                            replacements: [
                                sector.id,
                                idResponsable,
                                id_tanque_preparado,
                                litrosProporcionales.toFixed(2),
                                observaciones || null,
                                temporada
                            ],
                            transaction,
                            type: sequelize.QueryTypes.RAW
                        }
                    )

                    const [outRow] = await sequelize.query('SELECT @p_id_fertilizacion AS id', {
                        transaction,
                        type: sequelize.QueryTypes.SELECT
                    })

                    if (outRow?.id) createdIds.push(outRow.id)
                }

                return createdIds
            },
            { operation: 'CREATE_FERTILIZACION_BULK', userId: req.user?.id }
        )

        res.status(201).json({
            success: true,
            message: 'Fertilización múltiple registrada exitosamente',
            data: { ids: idsCreados }
        })
    })

    static obtenerFertilizaciones = asyncHandler(async (req, res) => {
        const { anio, mes } = req.query
        validateRequiredData(req.query, ['anio', 'mes'], { operation: 'OBTENER_FERTILIZACIONES' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_obtener_fertilizaciones(?, ?)',
                {
                    replacements: [parseInt(anio), parseInt(mes)],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'OBTENER_FERTILIZACIONES', userId: req.user?.id, anio, mes }
        )

        res.json({
            success: true,
            message: 'Fertilizaciones obtenidas exitosamente',
            data: results[0]
        })
    })

    static reporteSemanal = asyncHandler(async (req, res) => {
        const { anio, mes } = req.query
        validateRequiredData(req.query, ['anio', 'mes'], { operation: 'REPORTE_SEMANAL' })

        const results = await withDatabaseQuery(
            () => sequelize.query(
                'CALL sp_reporte_semanal_v2(?, ?)',
                {
                    replacements: [parseInt(anio), parseInt(mes)],
                    type: sequelize.QueryTypes.RAW
                }
            ),
            { operation: 'REPORTE_SEMANAL', userId: req.user?.id, anio, mes }
        )

        res.json({
            success: true,
            message: 'Reporte semanal V2 generado',
            data: results[0]
        })
    })

    static agregarTanque = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { id_tanque, litros_aplicados } = req.body

        validateRequiredData(
            { id, id_tanque, litros_aplicados },
            ['id', 'id_tanque', 'litros_aplicados'],
            { operation: 'ADD_TANQUE_FERTILIZACION' }
        )

        const resultado = await withTransaction(
            async (transaction) => {
                const fertilizacion = await withDatabaseQuery(
                    () => sequelize.query(
                        'SELECT * FROM fertilizaciones WHERE id = ?',
                        {
                            replacements: [id],
                            type: sequelize.QueryTypes.SELECT,
                            transaction
                        }
                    )
                )

                if (!fertilizacion || fertilizacion.length === 0) {
                    throw new NotFoundError('Fertilización no encontrada', { id })
                }

                const tanque = await TanquesPreparados.findByPk(id_tanque, { transaction, lock: transaction.LOCK_UPDATE })
                if (!tanque) throw new NotFoundError('Tanque preparado no encontrado', { id_tanque })

                if (parseFloat(tanque.litros_disponibles) < parseFloat(litros_aplicados)) {
                    throw new BusinessError(`Litros insuficientes. Disponibles: ${tanque.litros_disponibles}`, {
                        disponible: tanque.litros_disponibles,
                        solicitado: litros_aplicados
                    })
                }

                await sequelize.query(
                    `INSERT INTO detalle_fertilizacion_tanques (id_fertilizacion, id_tanque_preparado, litros_aplicados)
                     VALUES (?, ?, ?)`,
                    {
                        replacements: [id, id_tanque, litros_aplicados],
                        transaction
                    }
                )

                await tanque.update({
                    litros_disponibles: sequelize.literal(`litros_disponibles - ${litros_aplicados}`)
                }, { transaction })

                return { message: 'Tanque agregado correctamente', id_fertilizacion: id }
            },
            { operation: 'ADD_TANQUE_FERTILIZACION', userId: req.user?.id, fertilizacionId: id }
        )

        res.json({
            success: true,
            message: 'Tanque agregado a la fertilización',
            data: resultado
        })
    })

    static reporteFertilizacionCompleto = asyncHandler(async (req, res) => {
        const { anio, mes, id_rancho_dsa, id_sector, temporada } = req.query

        const results = await withDatabaseQuery(
            async () => {
                let query = 'SELECT * FROM npk_fertilizacion_completo WHERE 1=1'
                const replacements = []

                if (anio) {
                    query += ' AND anio = ?'
                    replacements.push(parseInt(anio))
                }
                if (mes) {
                    query += ' AND mes = ?'
                    replacements.push(parseInt(mes))
                }
                if (id_rancho_dsa) {
                    query += ' AND id_rancho_dsa = ?'
                    replacements.push(parseInt(id_rancho_dsa))
                }
                if (id_sector) {
                    query += ' AND id_sector = ?'
                    replacements.push(parseInt(id_sector))
                }
                if (temporada) {
                    query += ' AND temporada = ?'
                    replacements.push(temporada)
                }

                query += ' ORDER BY fecha DESC'

                return await sequelize.query(query, {
                    replacements,
                    type: sequelize.QueryTypes.SELECT
                })
            },
            { operation: 'GET_REPORTE_FERTILIZACION_COMPLETO', userId: req.user?.id }
        )

        res.json({ success: true, data: results })
    })

    static getDetalleTanquesPorCodigos = asyncHandler(async (req, res) => {
        const { codigos } = req.query

        if (!codigos) {
            return res.json({ success: true, data: [] })
        }

        const listaCodigos = codigos.split(',').map(c => c.trim()).filter(Boolean)

        if (listaCodigos.length === 0) {
            return res.json({ success: true, data: [] })
        }

        const resultado = await withDatabaseQuery(
            async () => {
                // Obtener tanques preparados con sus mezclas y activos
                const placeholders = listaCodigos.map(() => '?').join(',')
                const tanques = await sequelize.query(
                    `SELECT 
                        tp.id,
                        tp.codigo_tanque_preparado AS codigo,
                        tp.litros_totales,
                        tp.fecha_preparacion,
                        rd.nombre_rancho_dsa AS rancho,
                        mc.nombre AS nombre_mezcla,
                        mc.fabricante,
                        mt.cantidad_litros AS litros_mezcla,
                        am.nombre AS nombre_activo,
                        am.codigo AS codigo_activo,
                        ma.porcentaje,
                        am.unidad
                    FROM tanques_preparados tp
                    LEFT JOIN ranchos r ON r.id = tp.id_rancho
                    LEFT JOIN rancho_dsa rd on rd.id_rancho=r.id
                    LEFT JOIN mezclas_tanque mt ON mt.id_tanque_preparado = tp.id
                    LEFT JOIN mezclas mc ON mc.id = mt.id_mezcla
                    LEFT JOIN mezcla_activos ma ON ma.id_mezcla = mc.id
                    LEFT JOIN activo_mezcla am ON am.id = ma.id_activo
                    WHERE tp.codigo_tanque_preparado IN (${placeholders})
                    ORDER BY tp.codigo_tanque_preparado, mc.nombre, am.nombre`,
                    {
                        replacements: listaCodigos,
                        type: sequelize.QueryTypes.SELECT
                    }
                )

                // Agrupar por código de tanque
                const agrupado = {}
                tanques.forEach(row => {
                    const cod = row.codigo
                    if (!agrupado[cod]) {
                        agrupado[cod] = {
                            codigo: cod,
                            litros_totales: row.litros_totales,
                            fecha_preparacion: row.fecha_preparacion,
                            rancho: row.rancho,
                            mezclas: {}
                        }
                    }
                    if (row.nombre_mezcla) {
                        const mezKey = row.nombre_mezcla
                        if (!agrupado[cod].mezclas[mezKey]) {
                            agrupado[cod].mezclas[mezKey] = {
                                nombre: row.nombre_mezcla,
                                fabricante: row.fabricante,
                                litros: row.litros_mezcla,
                                activos: []
                            }
                        }
                        if (row.nombre_activo) {
                            agrupado[cod].mezclas[mezKey].activos.push({
                                nombre: row.nombre_activo,
                                codigo: row.codigo_activo,
                                porcentaje: row.porcentaje,
                                unidad: row.unidad
                            })
                        }
                    }
                })

                // Convertir mezclas de objeto a array
                return Object.values(agrupado).map(t => ({
                    ...t,
                    mezclas: Object.values(t.mezclas)
                }))
            },
            { operation: 'GET_DETALLE_TANQUES_POR_CODIGOS', userId: req.user?.id }
        )

        res.json({ success: true, data: resultado })
    })

    static duplicarTanquePreparado = asyncHandler(async (req, res) => {
        const { id } = req.params
        const logger = req.logger
        const logContext = { operation: 'DUPLICAR_TANQUE_PREPARADO', userId: req.user?.id }

        logger.info('Iniciando duplicación de tanque preparado', { ...logContext, tanqueId: id })

        // Obtener el tanque original con todas sus mezclas
        const tanqueOriginal = await withDatabaseQuery(
            () => TanquesPreparados.findByPk(id, {
                include: [
                    {
                        model: MezclasTanque,
                        include: [
                            {
                                model: MezclaCatalogo,
                                include: [
                                    {
                                        model: MezclaActivos,
                                        include: [{ model: ActivoMezcla }]
                                    }
                                ]
                            }
                        ]
                    },
                    { model: Tanques },
                    {
                        model: Ranchos,
                        include: [{ model: RanchoDsa }]
                    }
                ]
            }),
            { operation: 'GET_TANQUE_ORIGINAL_PARA_DUPLICAR', userId: req.user?.id, tanqueId: id }
        )

        if (!tanqueOriginal) {
            throw new NotFoundError('Tanque preparado no encontrado', { id })
        }

        // Iniciar transacción para garantizar consistencia
        const resultado = await withDatabaseQuery(
            async (transaction) => {
                // Generar código basado en el código original del tanque
                const codigoOriginal = tanqueOriginal.codigo_tanque_preparado || 'TANQUE-SIN-CODIGO'

                // Buscar duplicados existentes con el mismo código base
                const existingDuplicates = await TanquesPreparados.findAll({
                    where: {
                        codigo_tanque_preparado: {
                            [Op.like]: `${codigoOriginal}-%`
                        }
                    },
                    attributes: ['codigo_tanque_preparado'],
                    order: [['codigo_tanque_preparado', 'ASC']],
                    transaction
                })

                // Extraer el número más alto de los duplicados existentes
                let maxSuffix = 0
                existingDuplicates.forEach(tanque => {
                    const codigo = tanque.codigo_tanque_preparado
                    const match = codigo.match(new RegExp(`^${codigoOriginal}-(\\d+)$`))
                    if (match) {
                        const suffix = parseInt(match[1], 10)
                        if (suffix > maxSuffix) {
                            maxSuffix = suffix
                        }
                    }
                })

                // Generar nuevo código con sufijo incremental
                const codigoTanquePreparado = `${codigoOriginal}-${maxSuffix + 1}`

                // Crear nuevo tanque preparado
                const nuevoTanque = await TanquesPreparados.create({
                    id_tanque: tanqueOriginal.id_tanque,
                    id_rancho: tanqueOriginal.id_rancho,
                    litros_totales: tanqueOriginal.litros_totales,
                    litros_disponibles: tanqueOriginal.litros_totales,
                    fecha_preparacion: new Date(),
                    estado: 'preparado',
                    codigo_tanque_preparado: codigoTanquePreparado,
                    creado_por: req.user?.id
                }, { transaction })

                // Duplicar todas las mezclas
                if (tanqueOriginal.MezclasTanques && tanqueOriginal.MezclasTanques.length > 0) {
                    for (const mezclaOriginal of tanqueOriginal.MezclasTanques) {
                        await MezclasTanque.create({
                            id_tanque_preparado: nuevoTanque.id,
                            id_mezcla: mezclaOriginal.id_mezcla,
                            cantidad_litros: mezclaOriginal.cantidad_litros
                        }, { transaction })
                    }
                }

                // Obtener el tanque creado con todas sus relaciones
                const tanqueCreado = await TanquesPreparados.findByPk(nuevoTanque.id, {
                    include: [
                        {
                            model: MezclasTanque,
                            include: [
                                {
                                    model: MezclaCatalogo,
                                    include: [
                                        {
                                            model: MezclaActivos,
                                            include: [{ model: ActivoMezcla }]
                                        }
                                    ]
                                }
                            ]
                        },
                        { model: Tanques },
                        {
                            model: Ranchos,
                            include: [{ model: RanchoDsa }]
                        }
                    ],
                    transaction
                })

                return tanqueCreado
            },
            {
                operation: 'DUPLICAR_TANQUE_PREPARADO',
                userId: req.user?.id,
                tanqueOriginalId: id,
                nuevoTanqueId: null
            }
        )

        logger.info('Tanque duplicado exitosamente', {
            ...logContext,
            tanqueOriginalId: id,
            nuevoTanqueId: resultado.id
        })

        res.json({
            success: true,
            message: 'Tanque duplicado exitosamente',
            data: resultado
        })
    })

    static reporteExcelFertilizacion = asyncHandler(async (req, res) => {
        const { anio, mes, id_rancho_dsa, id_sector, temporada } = req.query

        const data = await withDatabaseQuery(
            async () => {
                let query = 'SELECT * FROM npk_fertilizacion_completo WHERE 1=1'
                const replacements = []

                if (anio) {
                    query += ' AND anio = ?'
                    replacements.push(parseInt(anio))
                }
                if (mes) {
                    query += ' AND mes = ?'
                    replacements.push(parseInt(mes))
                }
                if (id_rancho_dsa) {
                    query += ' AND id_rancho_dsa = ?'
                    replacements.push(parseInt(id_rancho_dsa))
                }
                if (id_sector) {
                    query += ' AND id_sector = ?'
                    replacements.push(parseInt(id_sector))
                }
                if (temporada) {
                    query += ' AND temporada = ?'
                    replacements.push(temporada)
                }

                query += ' ORDER BY fecha DESC'

                return await sequelize.query(query, {
                    replacements,
                    type: sequelize.QueryTypes.SELECT
                })
            },
            { operation: 'EXPORT_EXCEL_FERTILIZACION', userId: req.user?.id }
        )

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: 'No hay datos para exportar' })
        }

        const workbook = new ExcelJS.Workbook()

        // 1. Hoja de Detalle de Fertilizaciones
        const worksheetDetalle = workbook.addWorksheet('Detalle Fertilizaciones')
        worksheetDetalle.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Rancho DSA', key: 'nombre_rancho_dsa', width: 20 },
            { header: 'Sector', key: 'sector_interno', width: 15 },
            { header: 'Variedad', key: 'variedad', width: 15 },
            { header: 'Hectáreas', key: 'hectareas', width: 12 },
            { header: 'Tanque', key: 'codigo_tanque_preparado', width: 18 },
            { header: 'Litros Aplicados', key: 'litros_aplicados', width: 15 },
            { header: 'N (kg)', key: 'N_kg', width: 12 },
            { header: 'P (kg)', key: 'P_kg', width: 12 },
            { header: 'K (kg)', key: 'K_kg', width: 12 },
            { header: 'N/ha', key: 'N_kg_ha', width: 12 },
            { header: 'P/ha', key: 'P_kg_ha', width: 12 },
            { header: 'K/ha', key: 'K_kg_ha', width: 12 },
            { header: 'Temporada', key: 'temporada', width: 12 }
        ]
        worksheetDetalle.addRows(data)

        // 2. Hoja de KPIs Generales
        const worksheetKPIs = workbook.addWorksheet('KPIs Generales')

        // Calcular KPIs
        const totalEventos = data.length
        const totalLitros = data.reduce((acc, curr) => acc + (parseFloat(curr.litros_aplicados) || 0), 0)
        const tanquesUnicos = [...new Set(data.map(d => d.codigo_tanque_preparado))].length
        const totalHectareas = data.reduce((acc, curr) => acc + (parseFloat(curr.hectareas) || 0), 0)
        const totalN = data.reduce((acc, curr) => acc + (parseFloat(curr.N_kg) || 0), 0)
        const totalP = data.reduce((acc, curr) => acc + (parseFloat(curr.P_kg) || 0), 0)
        const totalK = data.reduce((acc, curr) => acc + (parseFloat(curr.K_kg) || 0), 0)

        worksheetKPIs.columns = [
            { header: 'Indicador', key: 'indicador', width: 25 },
            { header: 'Valor', key: 'valor', width: 20 }
        ]

        worksheetKPIs.addRows([
            { indicador: 'Total Fertilizaciones', valor: totalEventos },
            { indicador: 'Total Litros Aplicados', valor: totalLitros.toFixed(2) },
            { indicador: 'Total Tanques Utilizados', valor: tanquesUnicos },
            { indicador: 'Total Hectáreas', valor: totalHectareas.toFixed(2) },
            { indicador: 'Total Nitrógeno (kg)', valor: totalN.toFixed(2) },
            { indicador: 'Total Fósforo (kg)', valor: totalP.toFixed(2) },
            { indicador: 'Total Potasio (kg)', valor: totalK.toFixed(2) }
        ])

        // 3. Hoja de NPK por Rancho
        const worksheetRancho = workbook.addWorksheet('NPK por Rancho')
        const npkPorRancho = {}
        data.forEach(row => {
            const key = row.nombre_rancho_dsa || 'Sin definir'
            if (!npkPorRancho[key]) npkPorRancho[key] = { N: 0, P: 0, K: 0, ha: 0 }
            npkPorRancho[key].N += parseFloat(row.N_kg) || 0
            npkPorRancho[key].P += parseFloat(row.P_kg) || 0
            npkPorRancho[key].K += parseFloat(row.K_kg) || 0
            npkPorRancho[key].ha += parseFloat(row.hectareas) || 0
        })

        worksheetRancho.columns = [
            { header: 'Rancho DSA', key: 'rancho', width: 25 },
            { header: 'N (kg)', key: 'N', width: 15 },
            { header: 'P (kg)', key: 'P', width: 15 },
            { header: 'K (kg)', key: 'K', width: 15 },
            { header: 'N/ha', key: 'N_ha', width: 15 },
            { header: 'P/ha', key: 'P_ha', width: 15 },
            { header: 'K/ha', key: 'K_ha', width: 15 }
        ]

        Object.entries(npkPorRancho).sort(([, a], [, b]) => b.N - a.N).forEach(([nombre, npk]) => {
            const ha = npk.ha || 1
            worksheetRancho.addRow({
                rancho: nombre,
                N: npk.N.toFixed(2),
                P: npk.P.toFixed(2),
                K: npk.K.toFixed(2),
                N_ha: (npk.N / ha).toFixed(2),
                P_ha: (npk.P / ha).toFixed(2),
                K_ha: (npk.K / ha).toFixed(2)
            })
        })

        // 4. Hoja de Tanques y Composición
        const worksheetTanques = workbook.addWorksheet('Tanques y Composición')

        // Obtener códigos únicos de tanques
        const codigosTanques = [...new Set(data.map(d => d.codigo_tanque_preparado).filter(Boolean))]

        if (codigosTanques.length > 0) {
            // Obtener detalle de tanques
            const placeholders = codigosTanques.map(() => '?').join(',')
            const detalleTanques = await sequelize.query(
                `SELECT 
                    tp.codigo_tanque_preparado AS codigo,
                    tp.litros_totales,
                    tp.fecha_preparacion,
                    rd.nombre_rancho_dsa AS rancho,
                    mc.nombre AS nombre_mezcla,
                    mc.fabricante,
                    mt.cantidad_litros AS litros_mezcla,
                    am.nombre AS nombre_activo,
                    am.codigo AS codigo_activo,
                    ma.porcentaje,
                    am.unidad,
                    (mt.cantidad_litros * ma.porcentaje / 100) AS litros_activo
                FROM tanques_preparados tp
                LEFT JOIN ranchos r ON r.id = tp.id_rancho
                LEFT JOIN rancho_dsa rd on rd.id_rancho=r.id
                LEFT JOIN mezclas_tanque mt ON mt.id_tanque_preparado = tp.id
                LEFT JOIN mezclas mc ON mc.id = mt.id_mezcla
                LEFT JOIN mezcla_activos ma ON ma.id_mezcla = mc.id
                LEFT JOIN activo_mezcla am ON am.id = ma.id_activo
                WHERE tp.codigo_tanque_preparado IN (${placeholders})
                ORDER BY tp.codigo_tanque_preparado, mc.nombre, am.nombre`,
                {
                    replacements: codigosTanques,
                    type: sequelize.QueryTypes.SELECT
                }
            )

            // Agrupar tanques
            const tanquesAgrupados = {}
            detalleTanques.forEach(row => {
                const cod = row.codigo
                if (!tanquesAgrupados[cod]) {
                    tanquesAgrupados[cod] = {
                        codigo: cod,
                        litros_totales: row.litros_totales,
                        fecha_preparacion: row.fecha_preparacion,
                        rancho: row.rancho,
                        mezclas: {}
                    }
                }
                if (row.nombre_mezcla) {
                    const mezKey = row.nombre_mezcla
                    if (!tanquesAgrupados[cod].mezclas[mezKey]) {
                        tanquesAgrupados[cod].mezclas[mezKey] = {
                            nombre: row.nombre_mezcla,
                            fabricante: row.fabricante,
                            litros: row.litros_mezcla,
                            activos: []
                        }
                    }
                    if (row.nombre_activo) {
                        tanquesAgrupados[cod].mezclas[mezKey].activos.push({
                            nombre: row.nombre_activo,
                            codigo: row.codigo_activo,
                            porcentaje: row.porcentaje,
                            unidad: row.unidad,
                            litros_activo: row.litros_activo
                        })
                    }
                }
            })

            // Agregar encabezados
            worksheetTanques.columns = [
                { header: 'Tanque', key: 'tanque', width: 15 },
                { header: 'Rancho', key: 'rancho', width: 20 },
                { header: 'Fecha Preparación', key: 'fecha', width: 15 },
                { header: 'Litros Totales', key: 'litros_totales', width: 12 },
                { header: 'Mezcla', key: 'mezcla', width: 20 },
                { header: 'Fabricante', key: 'fabricante', width: 15 },
                { header: 'Litros Mezcla', key: 'litros_mezcla', width: 12 },
                { header: 'Activo', key: 'activo', width: 20 },
                { header: 'Código Activo', key: 'codigo_activo', width: 12 },
                { header: 'Porcentaje', key: 'porcentaje', width: 10 },
                { header: 'Litros Activo', key: 'litros_activo', width: 12 },
                { header: 'Unidad', key: 'unidad', width: 8 }
            ]

            // Agregar datos de tanques
            Object.values(tanquesAgrupados).forEach(tanque => {
                if (Object.keys(tanque.mezclas).length === 0) {
                    worksheetTanques.addRow({
                        tanque: tanque.codigo,
                        rancho: tanque.rancho,
                        fecha: tanque.fecha_preparacion,
                        litros_totales: tanque.litros_totales,
                        mezcla: 'Sin mezclas',
                        fabricante: '',
                        litros_mezcla: '',
                        activo: '',
                        codigo_activo: '',
                        porcentaje: '',
                        litros_activo: '',
                        unidad: ''
                    })
                } else {
                    Object.values(tanque.mezclas).forEach((mezcla, idx) => {
                        if (mezcla.activos.length === 0) {
                            worksheetTanques.addRow({
                                tanque: idx === 0 ? tanque.codigo : '',
                                rancho: idx === 0 ? tanque.rancho : '',
                                fecha: idx === 0 ? tanque.fecha_preparacion : '',
                                litros_totales: idx === 0 ? tanque.litros_totales : '',
                                mezcla: mezcla.nombre,
                                fabricante: mezcla.fabricante,
                                litros_mezcla: mezcla.litros,
                                activo: 'Sin activos',
                                codigo_activo: '',
                                porcentaje: '',
                                litros_activo: '',
                                unidad: ''
                            })
                        } else {
                            mezcla.activos.forEach((activo, actIdx) => {
                                worksheetTanques.addRow({
                                    tanque: idx === 0 && actIdx === 0 ? tanque.codigo : '',
                                    rancho: idx === 0 && actIdx === 0 ? tanque.rancho : '',
                                    fecha: idx === 0 && actIdx === 0 ? tanque.fecha_preparacion : '',
                                    litros_totales: idx === 0 && actIdx === 0 ? tanque.litros_totales : '',
                                    mezcla: actIdx === 0 ? mezcla.nombre : '',
                                    fabricante: actIdx === 0 ? mezcla.fabricante : '',
                                    litros_mezcla: actIdx === 0 ? mezcla.litros : '',
                                    activo: activo.nombre,
                                    codigo_activo: activo.codigo,
                                    porcentaje: activo.porcentaje,
                                    litros_activo: activo.litros_activo ? parseFloat(activo.litros_activo).toFixed(2) : '',
                                    unidad: activo.unidad
                                })
                            })
                        }
                    })
                }
            })
        } else {
            worksheetTanques.columns = [
                { header: 'Mensaje', key: 'mensaje', width: 30 }
            ]
            worksheetTanques.addRow({ mensaje: 'No hay tanques disponibles para los datos seleccionados' })
        }

        // Estilizar encabezados en todas las hojas
        [worksheetDetalle, worksheetKPIs, worksheetRancho, worksheetTanques].forEach(worksheet => {
            worksheet.getRow(1).font = { bold: true }
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6B8AF' }
            }
            worksheet.columns.forEach(column => {
                column.width = Math.max(column.width || 10, 10)
            })
        })

        // Generar nombre de archivo
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const filename = `reporte_fertilizacion_${timestamp}.xlsx`

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

        // Enviar archivo
        await workbook.xlsx.write(res)
        res.end()
    })
}
