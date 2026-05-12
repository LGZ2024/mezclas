/* eslint-disable camelcase */
import { Empresas } from '../schema/empresas.js'
import { Sectores } from '../schema/sectores.js'
import { Ranchos } from '../schema/ranchos.js'
import { RanchoDsa } from '../schema/rancho_dsa.js'
import { Tanques } from '../schema/tanques.js'
import { ActivoMezcla } from '../schema/activo_mezcla.js'
import { Temporada } from '../schema/temporada.js'

import { asyncHandler } from '../utils/asyncHandler.js'
import { validateRequiredData } from '../utils/errorHandlers.js'
import { NotFoundError } from '../utils/CustomError.js'

import sequelize from '../db/db.js'

export class CorporativoController {
    // ========== VISTAS ==========
    static renderEmpresas = asyncHandler(async (req, res) => {
        res.render('pages/catalogo/empresas', {
            title: 'Empresas',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderSectores = asyncHandler(async (req, res) => {
        const ranchosDsa = await RanchoDsa.findAll({
            include: [{
                model: Ranchos,
                attributes: ['id', 'rancho']
            }],
            where: { status: 1 }
        })
        res.render('pages/catalogo/sectores', {
            title: 'Sectores',
            user: req.user,
            rol: req.user.rol,
            ranchosDsa
        })
    })

    static renderRanchos = asyncHandler(async (req, res) => {
        const empresas = await Empresas.findAll({ where: { status: 1 } })
        res.render('pages/catalogo/ranchos', {
            title: 'Ranchos',
            user: req.user,
            rol: req.user.rol,
            empresas
        })
    })

    static renderTanques = asyncHandler(async (req, res) => {
        const ranchos = await Ranchos.findAll({ where: { status: 1 } })
        res.render('pages/catalogo/tanques', {
            title: 'Tanques',
            user: req.user,
            rol: req.user.rol,
            ranchos
        })
    })

    static renderActivosMezcla = asyncHandler(async (req, res) => {
        res.render('pages/catalogo/activos_mezcla', {
            title: 'Activos de Mezcla',
            user: req.user,
            rol: req.user.rol
        })
    })

    static renderRanchoDsa = asyncHandler(async (req, res) => {
        const ranchos = await Ranchos.findAll({ where: { status: 1 } })
        res.render('pages/catalogo/rancho_dsa', {
            title: 'Rancho DSA',
            user: req.user,
            rol: req.user.rol,
            ranchos
        })
    })

    // ========== API GET (READ) ==========
    static getEmpresas = asyncHandler(async (req, res) => {
        const empresas = await Empresas.findAll()
        res.json(empresas)
    })

    static getSectores = asyncHandler(async (req, res) => {
        const sectores = await Sectores.findAll({
            include: [
                {
                    model: RanchoDsa,
                    attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
                    include: [{
                        model: Ranchos,
                        attributes: ['id', 'rancho']
                    }]
                }
            ]
        })
        res.json(sectores)
    })

    static getSectoresPorRancho = asyncHandler(async (req, res) => {
        const { rancho_id } = req.params
        const sectores = await Sectores.findAll({
            where: { id_rancho_dsa: rancho_id, status: 1 },
            include: [
                {
                    model: RanchoDsa,
                    attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
                    include: [{
                        model: Ranchos,
                        attributes: ['id', 'rancho']
                    }]
                }
            ]
        })
        res.json(sectores)
    })

    static getRanchos = asyncHandler(async (req, res) => {
        const ranchos = await Ranchos.findAll({
            include: [{ model: Empresas, attributes: ['id', 'nombre_comercial'] }]
        })
        res.json(ranchos)
    })

    static getTanques = asyncHandler(async (req, res) => {
        const tanques = await Tanques.findAll({
            include: [{ model: Ranchos, attributes: ['id', 'rancho'] }]
        })
        res.json(tanques)
    })

    static getTanquesPorRancho = asyncHandler(async (req, res) => {
        const { rancho_id } = req.params
        const tanques = await Tanques.findAll({
            where: { id_rancho: rancho_id, status: 1 },
            include: [{ model: Ranchos, attributes: ['id', 'rancho'] }]
        })
        res.json(tanques)
    })

    static getActivosMezcla = asyncHandler(async (req, res) => {
        const activos = await ActivoMezcla.findAll()
        res.json(activos)
    })

    static getRanchosDsa = asyncHandler(async (req, res) => {
        const ranchos = await RanchoDsa.findAll({
            include: [{
                model: Ranchos,
                attributes: ['id', 'rancho']
            }],
            where: { status: 1 }
        })
        res.json(ranchos)
    })

    // ========== API POST (CREATE), PUT (UPDATE), DELETE ==========

    // --- EMPRESAS ---
    static createEmpresa = asyncHandler(async (req, res) => {
        const { nombre_comercial, razon_social, rfc } = req.body
        validateRequiredData(req.body, ['nombre_comercial', 'razon_social', 'rfc'], { operation: 'CREATE_EMPRESA' })

        const nuevaEmpresa = await Empresas.create({ nombre_comercial, razon_social, rfc, status: 1 })
        res.status(201).json({ success: true, message: 'Empresa creada correctamenta', data: nuevaEmpresa })
    })

    static updateEmpresa = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { nombre_comercial, razon_social, rfc, status } = req.body

        const empresa = await Empresas.findByPk(id)
        if (!empresa) throw new NotFoundError('Empresa no encontrada')

        await empresa.update({ nombre_comercial, razon_social, rfc, status })
        res.json({ success: true, message: 'Empresa actualizada correctamente', data: empresa })
    })

    static deleteEmpresa = asyncHandler(async (req, res) => {
        const { id } = req.params
        const empresa = await Empresas.findByPk(id)
        if (!empresa) throw new NotFoundError('Empresa no encontrada')

        // Soft delete (cambiar status a 0)
        await empresa.update({ status: 0 })
        res.json({ success: true, message: 'Empresa eliminada correctamente' })
    })

    // --- RANCHOS ---
    static createRancho = asyncHandler(async (req, res) => {
        const { rancho, id_empresa } = req.body
        validateRequiredData(req.body, ['rancho', 'id_empresa'], { operation: 'CREATE_RANCHO' })

        const nuevoRancho = await Ranchos.create({ rancho, id_empresa, status: 1 })
        res.status(201).json({ success: true, message: 'Rancho creado correctamente', data: nuevoRancho })
    })

    static updateRancho = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { rancho, id_empresa, status } = req.body

        const ranchoItem = await Ranchos.findByPk(id)
        if (!ranchoItem) throw new NotFoundError('Rancho no encontrado')

        await ranchoItem.update({ rancho, id_empresa, status })
        res.json({ success: true, message: 'Rancho actualizado correctamente', data: ranchoItem })
    })

    static deleteRancho = asyncHandler(async (req, res) => {
        const { id } = req.params
        const rancho = await Ranchos.findByPk(id)
        if (!rancho) throw new NotFoundError('Rancho no encontrado')

        await rancho.update({ status: 0 })
        res.json({ success: true, message: 'Rancho eliminado correctamente' })
    })

    // --- SECTORES ---
    static createSector = asyncHandler(async (req, res) => {
        const { sector_interno, sector_agrian, variedad, hectareas, id_rancho_dsa } = req.body
        validateRequiredData(req.body, ['sector_interno', 'variedad', 'hectareas', 'id_rancho_dsa'], { operation: 'CREATE_SECTOR' })

        const nuevoSector = await Sectores.create({
            sector_interno,
            sector_agrian,
            variedad,
            hectareas,
            id_rancho_dsa,
            status: 1
        })
        res.status(201).json({ success: true, message: 'Sector creado correctamente', data: nuevoSector })
    })

    static updateSector = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { sector_interno, sector_agrian, variedad, hectareas, id_rancho_dsa, status } = req.body

        const sector = await Sectores.findByPk(id)
        if (!sector) throw new NotFoundError('Sector no encontrado')

        await sector.update({ sector_interno, sector_agrian, variedad, hectareas, id_rancho_dsa, status })
        res.json({ success: true, message: 'Sector actualizado correctamente', data: sector })
    })

    static deleteSector = asyncHandler(async (req, res) => {
        const { id } = req.params
        const sector = await Sectores.findByPk(id)
        if (!sector) throw new NotFoundError('Sector no encontrado')

        await sector.update({ status: 0 })
        res.json({ success: true, message: 'Sector eliminado correctamente' })
    })

    // --- TANQUES ---
    static createTanque = asyncHandler(async (req, res) => {
        const { codigo, etapa, capacidad, unidad, id_rancho } = req.body
        validateRequiredData(req.body, ['codigo', 'etapa', 'capacidad', 'id_rancho'], { operation: 'CREATE_TANQUE' })

        const nuevoTanque = await Tanques.create({
            codigo,
            etapa,
            capacidad,
            unidad: unidad || 'L',
            status: 1,
            id_rancho
        })
        res.status(201).json({ success: true, message: 'Tanque creado correctamente', data: nuevoTanque })
    })

    static updateTanque = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { codigo, etapa, capacidad, unidad, id_rancho, status } = req.body

        const tanque = await Tanques.findByPk(id)
        if (!tanque) throw new NotFoundError('Tanque no encontrado')

        await tanque.update({ codigo, etapa, capacidad, unidad, id_rancho, status })
        res.json({ success: true, message: 'Tanque actualizado correctamente', data: tanque })
    })

    static deleteTanque = asyncHandler(async (req, res) => {
        const { id } = req.params
        const tanque = await Tanques.findByPk(id)
        if (!tanque) throw new NotFoundError('Tanque no encontrado')

        await tanque.update({ status: 0 })
        res.json({ success: true, message: 'Tanque eliminado correctamente' })
    })

    // --- ACTIVOS MEZCLA ---
    static createActivoMezcla = asyncHandler(async (req, res) => {
        const { nombre, codigo, tipo, es_principal, unidad } = req.body
        validateRequiredData(req.body, ['nombre', 'codigo', 'unidad'], { operation: 'CREATE_ACTIVO_MEZCLA' })

        const nuevoActivo = await ActivoMezcla.create({
            nombre,
            codigo,
            tipo,
            es_principal: es_principal || 0,
            unidad
        })
        res.status(201).json({ success: true, message: 'Activo creado correctamente', data: nuevoActivo })
    })

    static updateActivoMezcla = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { nombre, codigo, tipo, es_principal, unidad } = req.body

        const activo = await ActivoMezcla.findByPk(id)
        if (!activo) throw new NotFoundError('Activo no encontrado')

        await activo.update({ nombre, codigo, tipo, es_principal, unidad })
        res.json({ success: true, message: 'Activo actualizado correctamente', data: activo })
    })

    static deleteActivoMezcla = asyncHandler(async (req, res) => {
        const { id } = req.params
        const activo = await ActivoMezcla.findByPk(id)
        if (!activo) throw new NotFoundError('Activo no encontrado')

        // Note: activo_mezcla schema doesn't have status field, so we'll do hard delete
        await activo.destroy()
        res.json({ success: true, message: 'Activo eliminado correctamente' })
    })

    // ---Ranchos DSA--
    static createRanchoDsa = asyncHandler(async (req, res) => {
        const { nombre_rancho_dsa, id_rancho, numero_rancho_dsa } = req.body
        validateRequiredData(req.body, ['id_rancho', 'nombre_rancho_dsa', 'numero_rancho_dsa'], { operation: 'CREATE_RANCHO_DSA' })

        const nuevoRancho = await RanchoDsa.create({
            nombre_rancho_dsa,
            id_rancho,
            numero_rancho_dsa
        })
        res.status(201).json({ success: true, message: 'Rancho DSA creado correctamente', data: nuevoRancho })
    })

    static updateRanchoDsa = asyncHandler(async (req, res) => {
        const { id } = req.params
        const { nombre_rancho_dsa, id_rancho, numero_rancho_dsa } = req.body
        validateRequiredData(req.body, ['id_rancho', 'nombre_rancho_dsa', 'numero_rancho_dsa'], { operation: 'UPDATE_RANCHO_DSA' })

        const rancho = await RanchoDsa.findByPk(id)
        if (!rancho) throw new NotFoundError('Rancho DSA no encontrado')

        await rancho.update({
            nombre_rancho_dsa,
            id_rancho,
            numero_rancho_dsa
        })
        res.json({ success: true, message: 'Rancho DSA actualizado correctamente', data: rancho })
    })

    static deleteRanchoDsa = asyncHandler(async (req, res) => {
        const { id } = req.params
        const rancho = await RanchoDsa.findByPk(id)
        if (!rancho) throw new NotFoundError('Rancho DSA no encontrado')

        await rancho.destroy()
        res.json({ success: true, message: 'Rancho DSA eliminado correctamente' })
    })

    // --- TEMPORADAS ---
    static getTemporadas = asyncHandler(async (req, res) => {
        const temporadas = await Temporada.findAll({ where: { status: 1 } })
        res.json({ temporadas })
    })

    static getAnios = asyncHandler(async (req, res) => {
        const anios = await sequelize.query(`
                    SELECT anio FROM npk_fertilizacion_completo GROUP by anio
                    `, { type: sequelize.QueryTypes.SELECT })
        res.json({ anios })
    })
}
