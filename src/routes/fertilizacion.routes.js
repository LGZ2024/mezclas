import { Router } from 'express'
import { FertilizacionController } from '../controller/fertilizacion.controller.js'
import { checkRoleAuth } from '../middlewares/authMiddleware.js'

export const createFertilizacionRouter = () => {
    const router = Router()

    // ========== CATÁLOGOS Y DATOS ==========
    router.get('/catalogos', FertilizacionController.getCatalogos)
    router.get('/tanques-preparados', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.getTanquesPreparados)
    router.post('/tanques-preparados/:id/duplicar', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.duplicarTanquePreparado)
    router.get('/tanques-preparados/rancho/:id_rancho', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.getTanquesPreparadosPorRancho)

    // ========== RENDERIZAR PÁGINAS ==========
    router.get('/mezclas', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.renderMezclas)
    router.get('/graficas', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.renderGraficas)
    router.get('/preparar-tanque', checkRoleAuth(['produccion', 'master']), FertilizacionController.renderPrepararTanque)
    router.get('/nueva-estructura/registro', checkRoleAuth(['inocuidad', 'master']), FertilizacionController.renderNuevaEstructuraRegistro)
    router.get('/nueva-estructura/reportes', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.renderNuevaEstructuraReportes)

    // ========== GESTIÓN DE MEZCLAS CATÁLOGO (API) ==========
    // Crear nueva mezcla catálogo
    router.post('/mezclas', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.crearMezcla)
    // Actualizar mezcla catálogo
    router.put('/mezclas/:id', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.actualizarMezcla)
    // Eliminar mezcla catálogo
    router.delete('/mezclas/:id', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.eliminarMezcla)
    // Obtener todas las mezclas catálogo (API)
    router.get('/catalogo/mezclas', FertilizacionController.obtenerMezclas)
    // Obtener una mezcla específica por ID
    router.get('/mezclas/:id', FertilizacionController.obtenerMezclaPorId)
    // Asignar ingredientes a una mezcla catálogo (definir receta)
    router.post('/mezclas/:id_mezcla/ingredientes', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.asignarActivosMezcla)
    // Obtener ingredientes de una mezcla
    router.get('/mezclas/:id_mezcla/ingredientes', FertilizacionController.obtenerActivosMezcla)
    // Actualizar ingredientes de una mezcla (eliminar los viejos y agregar los nuevos)
    router.put('/mezclas/:id_mezcla/ingredientes', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.actualizarActivosMezcla)

    // ========== PREPARACIÓN DE TANQUES EN CAMPO ==========
    // PASO 1: Preparar tanque (seleccionar mezcla existente + tanque físico)
    router.post('/preparar-tanque', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.crearTanquePreparado)
    router.get('/tanques-preparados/:id', FertilizacionController.getDetalleTanque)
    router.get('/tanques-preparados/rancho/:id_rancho', FertilizacionController.getTanquesPreparadosPorRancho)

    // ========== FERTILIZACIONES ==========
    // Registrar nueva fertilización
    router.post('/fertilizaciones', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.registrarFertilizacion)
    // Registrar fertilización múltiple (sectores + horas)
    router.post('/fertilizaciones/bulk', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.registrarFertilizacionBulk)
    // Agregar tanque a fertilización existente
    router.post('/fertilizaciones/:id/tanques', checkRoleAuth(['inocuidad', 'produccion', 'master']), FertilizacionController.agregarTanque)

    // ========== REPORTES ESPECIALIZADOS (API) ==========
    router.get('/reportes/inventario', FertilizacionController.reporteInventario)
    router.get('/reportes/resumen-anual', FertilizacionController.reporteResumenAnual)
    router.get('/reportes/semanal', FertilizacionController.reporteSemanal)
    router.get('/reportes/por-variedad', FertilizacionController.reportePorVariedad)
    router.get('/reportes/mensual-rancho', FertilizacionController.reporteMensualRancho)
    router.get('/reportes/comparativo-mensual', FertilizacionController.reporteComparativoMensual)
    router.get('/reportes/top-sectores', FertilizacionController.reporteTopSectores)

    router.get('/reportes/fertilizacion', FertilizacionController.reporteFertilizacionCompleto)
    router.get('/reportes/exportar', FertilizacionController.reporteExcelFertilizacion)
    router.get('/reportes/detalle-tanques', FertilizacionController.getDetalleTanquesPorCodigos)

    return router
}
