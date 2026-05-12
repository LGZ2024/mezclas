import { Router } from 'express'
import { CorporativoController } from '../controller/corporativo.controller.js'
import { checkRoleAuth } from '../middlewares/authMiddleware.js'

export const createCorporativoRouter = () => {
    const router = Router()

    // ========== RENDERIZAR PÁGINAS ==========
    router.get('/empresas', checkRoleAuth(['master']), CorporativoController.renderEmpresas)
    router.get('/sectores', checkRoleAuth(['master']), CorporativoController.renderSectores)
    router.get('/ranchos', checkRoleAuth(['master']), CorporativoController.renderRanchos)
    router.get('/tanques', checkRoleAuth(['master']), CorporativoController.renderTanques)
    router.get('/rancho-dsa', checkRoleAuth(['master']), CorporativoController.renderRanchoDsa)
    router.get('/activos-mezcla', checkRoleAuth(['master']), CorporativoController.renderActivosMezcla)

    // ========== RUTAS API ==========
    // --- EMPRESAS ---
    router.get('/api/empresas', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getEmpresas)
    router.post('/api/empresas', checkRoleAuth(['master']), CorporativoController.createEmpresa)
    router.put('/api/empresas/:id', checkRoleAuth(['master']), CorporativoController.updateEmpresa)
    router.delete('/api/empresas/:id', checkRoleAuth(['master']), CorporativoController.deleteEmpresa)

    // --- SECTORES ---
    router.get('/api/sectores/', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getSectores)
    router.get('/api/sectores/:rancho_id', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getSectoresPorRancho)
    router.post('/api/sectores', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.createSector)
    router.put('/api/sectores/:id', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.updateSector)
    router.delete('/api/sectores/:id', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.deleteSector)

    // --- RANCHOS ---
    router.get('/api/ranchos', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getRanchos)
    router.post('/api/ranchos', checkRoleAuth(['master']), CorporativoController.createRancho)
    router.put('/api/ranchos/:id', checkRoleAuth(['master']), CorporativoController.updateRancho)
    router.delete('/api/ranchos/:id', checkRoleAuth(['master']), CorporativoController.deleteRancho)

    // --- TANQUES ---
    router.get('/api/tanques', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getTanques)
    router.get('/api/tanques/:rancho_id', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getTanquesPorRancho)
    router.post('/api/tanques', checkRoleAuth(['master']), CorporativoController.createTanque)
    router.put('/api/tanques/:id', checkRoleAuth(['master']), CorporativoController.updateTanque)
    router.delete('/api/tanques/:id', checkRoleAuth(['master']), CorporativoController.deleteTanque)

    // --- ACTIVOS MEZCLA ---
    router.get('/api/activos-mezcla', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getActivosMezcla)
    router.post('/api/activos-mezcla', checkRoleAuth(['master']), CorporativoController.createActivoMezcla)
    router.put('/api/activos-mezcla/:id', checkRoleAuth(['master']), CorporativoController.updateActivoMezcla)
    router.delete('/api/activos-mezcla/:id', checkRoleAuth(['master']), CorporativoController.deleteActivoMezcla)

    // --- RANCHO DSA ---
    router.get('/api/rancho-dsa', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getRanchosDsa)
    router.post('/api/rancho-dsa', checkRoleAuth(['master']), CorporativoController.createRanchoDsa)
    router.put('/api/rancho-dsa/:id', checkRoleAuth(['master']), CorporativoController.updateRanchoDsa)
    router.delete('/api/rancho-dsa/:id', checkRoleAuth(['master']), CorporativoController.deleteRanchoDsa)

    // --- TEMPORADAS ---
    router.get('/api/temporadas', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getTemporadas)

    // --- ANIOS ---
    router.get('/api/anios', checkRoleAuth(['produccion', 'inocuidad', 'master']), CorporativoController.getAnios)

    return router
}
