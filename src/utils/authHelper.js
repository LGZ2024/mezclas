// accessHelpers.js
import sequelize from '../db/db.js'

/**
 * Nivel 1: tiene acceso al sistema?
 */
export async function tieneAccesoASistema(idUsuario, idSistema) {
    const [rows] = await sequelize.query(
        `SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idSistema = ? LIMIT 1`,
        { replacements: [idUsuario, idSistema] }
    );
    return rows.length > 0;
}

/**
 * Nivel 2: acceso a rancho (o acceso global a la empresa si idRancho IS NULL)
 */
export async function tieneAccesoARancho(idUsuario, idRancho, idEmpresa) {
    if (!idRancho) {
        // si no se pide rancho, validar que usuario tenga acceso a la empresa en ese sistema OR any entry for company
        const [rows] = await sequelize.query(
            `SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idEmpresa = ? LIMIT 1`,
            { replacements: [idUsuario, idEmpresa] }
        );
        return rows.length > 0;
    }
    const [rows] = await sequelize.query(
        `SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idEmpresa = ? AND (idRancho = ? OR idRancho IS NULL) LIMIT 1`,
        { replacements: [idUsuario, idEmpresa, idRancho] }
    );
    return rows.length > 0;
}

/**
 * Nivel 3: Permiso sobre módulo y acción
 * - moduleClave: clave del módulo (ej 'almacen')
 * - accion: 'create'|'read'|'update'|'approve' etc.
 * - idSistema: opcional para limitar por sistema
 */
export async function tienePermiso(idUsuario, moduleClave, accion, idSistema = null) {
    const params = [idUsuario, moduleClave, accion];
    let sql = `
    SELECT 1
    FROM usuarios_roles ur
    JOIN roles_permisos rp ON rp.idRol = ur.idRol
    JOIN permisos p ON p.idPermiso = rp.idPermiso
    JOIN modulos m ON m.idModulo = p.idModulo
    WHERE ur.idUsuario = ?
      AND m.clave = ?
      AND p.accion = ?
  `;
    if (idSistema) {
        sql += ' AND m.idSistema = ?';
        params.push(idSistema);
    }
    sql += ' LIMIT 1';
    const [rows] = await sequelize.query(sql, { replacements: params });
    return rows.length > 0;
}
