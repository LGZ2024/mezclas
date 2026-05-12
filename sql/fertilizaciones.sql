-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2026 a las 05:43:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fertilizaciones`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_comparativo_anual_ranchos` (IN `p_anio` INT)   BEGIN
    SELECT 
        r.rancho AS 'Rancho',
        COUNT(DISTINCT s.id) AS 'Sectores',
        ROUND(SUM(DISTINCT s.hectareas), 2) AS 'Hectáreas',
        COUNT(DISTINCT f.id) AS 'Fertilizaciones',
        ROUND(SUM(s.hectareas * 1), 2) AS 'Ha Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) AS 'Litros',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'N (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'N/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'P (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'P/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'K (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'K/Ha'
        
    FROM ranchos r
    LEFT JOIN sectores s ON r.id = s.id_rancho
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector AND YEAR(f.fecha) = p_anio
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    GROUP BY r.id, r.rancho
    HAVING COUNT(DISTINCT f.id) > 0
    ORDER BY r.rancho;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_comparativo_mensual` (IN `p_anio` INT, IN `p_id_rancho` INT)   BEGIN
    -- Comparativo de todos los meses del año
    SELECT 
        MONTHNAME(DATE(CONCAT(p_anio, '-', mes, '-01'))) as 'Mes',
        total_fertilizaciones as 'Fertilizaciones',
        sectores_fertilizados as 'Sectores',
        hectareas_regadas as 'Ha Regadas',
        ROUND(n_kilo_por_mes, 2) as 'N (KG)',
        ROUND(p_kilo_por_mes, 2) as 'P (KG)',
        ROUND(k_kilo_por_mes, 2) as 'K (KG)',
        ROUND(n_kilo_por_h_mes, 2) as 'N KG/Ha',
        ROUND(p_kilo_por_h_mes, 2) as 'P KG/Ha',
        ROUND(k_kilo_por_h_mes, 2) as 'K KG/Ha'
    FROM (
        SELECT 
            MONTH(f.fecha) as mes,
            COUNT(DISTINCT f.id) as total_fertilizaciones,
            COUNT(DISTINCT s.id) as sectores_fertilizados,
            ROUND(SUM(s.hectareas), 2) as hectareas_regadas,
            
            SUM(CASE WHEN a.codigo = 'N' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) as n_kilo_por_mes,
            
            SUM(CASE WHEN a.codigo = 'P2O5' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) as p_kilo_por_mes,
            
            SUM(CASE WHEN a.codigo = 'K2O' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) as k_kilo_por_mes,
            
            SUM(CASE WHEN a.codigo = 'N' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) / NULLIF(SUM(s.hectareas), 0) as n_kilo_por_h_mes,
            
            SUM(CASE WHEN a.codigo = 'P2O5' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) / NULLIF(SUM(s.hectareas), 0) as p_kilo_por_h_mes,
            
            SUM(CASE WHEN a.codigo = 'K2O' 
                THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
                ELSE 0 END) / NULLIF(SUM(s.hectareas), 0) as k_kilo_por_h_mes
            
        FROM fertilizaciones f
        INNER JOIN sectores s ON f.id_sector = s.id
        LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
        LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
        LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
        LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
        LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
        WHERE YEAR(f.fecha) = p_anio
          AND (p_id_rancho IS NULL OR s.id_rancho = p_id_rancho)
        GROUP BY MONTH(f.fecha)
    ) subquery
    ORDER BY mes;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_fertilizacion` (IN `p_sector` INT, IN `p_responsable` INT, IN `p_tanque_preparado` INT, IN `p_litros_aplicados` DECIMAL(10,2), IN `p_observaciones` TEXT, OUT `p_fertilizacion_id` INT, IN `p_temporada` TEXT)   BEGIN
    DECLARE v_litros_disponibles DECIMAL(10,2);
    DECLARE v_litros_totales DECIMAL(10,2);
    DECLARE v_fecha DATE;
    DECLARE v_nombre_sector VARCHAR(50);
    DECLARE v_mezclas_tanque TEXT;
    DECLARE v_N_total DECIMAL(10,4) DEFAULT 0;
    DECLARE v_P_total DECIMAL(10,4) DEFAULT 0;
    DECLARE v_K_total DECIMAL(10,4) DEFAULT 0;
    
    -- Variables para el cursor de activos
    DECLARE v_id_activo INT;
    DECLARE v_codigo_activo VARCHAR(20);
    DECLARE v_nombre_activo VARCHAR(50);
    DECLARE v_kg_aplicados DECIMAL(12,6);
    DECLARE v_finished INT DEFAULT 0;
    
    -- Cursor para recorrer todos los activos calculados
    DECLARE cursor_activos CURSOR FOR
        SELECT 
            a.id,
            a.codigo,
            a.nombre,
            ROUND(SUM(
                (p_litros_aplicados * mt.cantidad_litros / tp.litros_totales) 
                * (ma.porcentaje / 100)
            ), 6) as kg_aplicados
        FROM tanques_preparados tp
        INNER JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
        INNER JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
        INNER JOIN activo_mezcla a ON ma.id_activo = a.id
        WHERE tp.id = p_tanque_preparado
        GROUP BY a.id, a.codigo, a.nombre
        HAVING kg_aplicados > 0;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SET v_fecha = CURDATE();
    
    -- ========================================================================
    -- VALIDACIONES
    -- ========================================================================
    IF NOT EXISTS (SELECT 1 FROM sectores WHERE id = p_sector) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: El sector especificado no existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM tanques_preparados WHERE id = p_tanque_preparado) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: El tanque preparado no existe';
    END IF;
    
    IF p_litros_aplicados <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Los litros aplicados deben ser mayores a cero';
    END IF;
    
    -- ========================================================================
    -- CREAR REGISTRO DE FERTILIZACIÓN
    -- ========================================================================
    INSERT INTO fertilizaciones (id_sector, id_responsable, fecha,temporada, observaciones, status)
    VALUES (p_sector, p_responsable, v_fecha,p_temporada, IFNULL(p_observaciones, 'Fertilización automática'), 1);
    
    SET p_fertilizacion_id = LAST_INSERT_ID();
    
    -- ========================================================================
    -- OBTENER INFORMACIÓN DEL TANQUE CON BLOQUEO
    -- ========================================================================
    SELECT litros_disponibles, litros_totales
    INTO v_litros_disponibles, v_litros_totales
    FROM tanques_preparados
    WHERE id = p_tanque_preparado
    FOR UPDATE;
    
    -- Validar litros disponibles
    IF v_litros_disponibles < p_litros_aplicados THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Litros insuficientes en el tanque preparado';
    END IF;
    
    -- ========================================================================
    -- INSERTAR DETALLE DE FERTILIZACIÓN (SIN CAMPOS NPK)
    -- ========================================================================
    INSERT INTO detalle_fertilizacion_tanques (
        id_fertilizacion, 
        id_tanque_preparado, 
        litros_aplicados
    )
    VALUES (
        p_fertilizacion_id, 
        p_tanque_preparado, 
        p_litros_aplicados
    );
    
    -- ========================================================================
    -- CALCULAR E INSERTAR TODOS LOS ACTIVOS EN fertilizacion_activos
    -- ========================================================================
    OPEN cursor_activos;
    
    activos_loop: LOOP
        FETCH cursor_activos INTO v_id_activo, v_codigo_activo, v_nombre_activo, v_kg_aplicados;
        
        IF v_finished = 1 THEN
            LEAVE activos_loop;
        END IF;
        
        -- Insertar cada activo con su cantidad calculada
        INSERT INTO fertilizacion_activos (
            id_fertilizacion,
            id_activo,
            cantidad_aplicada
        )
        VALUES (
            p_fertilizacion_id,
            v_id_activo,
            v_kg_aplicados
        );
        
        -- Acumular NPK para el reporte final
        IF v_codigo_activo = 'N' THEN
            SET v_N_total = v_kg_aplicados;
        ELSEIF v_codigo_activo = 'P2O5' THEN
            SET v_P_total = v_kg_aplicados;
        ELSEIF v_codigo_activo = 'K2O' THEN
            SET v_K_total = v_kg_aplicados;
        END IF;
        
    END LOOP activos_loop;
    
    CLOSE cursor_activos;
    
    -- ========================================================================
    -- ACTUALIZAR INVENTARIO DEL TANQUE
    -- ========================================================================
    UPDATE tanques_preparados
    SET litros_disponibles = litros_disponibles - p_litros_aplicados
    WHERE id = p_tanque_preparado;
    
    -- ========================================================================
    -- REGISTRAR SI EL TANQUE SE VACÍA COMPLETAMENTE
    -- ========================================================================
    IF (v_litros_disponibles - p_litros_aplicados) = 0 THEN
        INSERT INTO aplicaciones_tanque (
            id_sector, 
            id_tanque_preparado, 
            id_responsable, 
            fecha, 
            litros_aplicados
        )
        VALUES (
            p_sector, 
            p_tanque_preparado, 
            p_responsable, 
            v_fecha, 
            v_litros_totales
        );
    END IF;
    
    -- ========================================================================
    -- OBTENER INFORMACIÓN PARA RETORNO
    -- ========================================================================
    SELECT s.sector_interno INTO v_nombre_sector
    FROM sectores s WHERE s.id = p_sector;
    
    -- Obtener mezclas del tanque
    SELECT GROUP_CONCAT(CONCAT(m.nombre, ' (', mt.cantidad_litros, 'L)') SEPARATOR ', ')
    INTO v_mezclas_tanque
    FROM mezclas_tanque mt
    INNER JOIN mezclas m ON mt.id_mezcla = m.id
    WHERE mt.id_tanque_preparado = p_tanque_preparado;
    
    COMMIT;
    
    -- ========================================================================
    -- RETORNAR RESUMEN COMPLETO
    -- ========================================================================
    SELECT 
        p_fertilizacion_id as id_fertilizacion,
        v_nombre_sector as sector,
        v_mezclas_tanque as mezclas,
        p_litros_aplicados as litros_aplicados,
        (v_litros_disponibles - p_litros_aplicados) as litros_restantes,
        ROUND(v_N_total, 2) as kg_nitrogeno,
        ROUND(v_P_total, 2) as kg_fosforo,
        ROUND(v_K_total, 2) as kg_potasio,
        (SELECT COUNT(*) FROM fertilizacion_activos WHERE id_fertilizacion = p_fertilizacion_id) as total_activos_registrados,
        CASE 
            WHEN (v_litros_disponibles - p_litros_aplicados) = 0 THEN 'TANQUE VACÍO'
            WHEN (v_litros_disponibles - p_litros_aplicados) < v_litros_totales * 0.25 THEN 'INVENTARIO BAJO'
            ELSE 'OK'
        END as alerta_inventario,
        'Fertilización registrada exitosamente. Activos calculados y almacenados.' as mensaje;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_inventario_tanques` ()   BEGIN
    SELECT 
        tp.codigo_tanque_preparado as 'Código Tanque',
        r.rancho as 'Rancho',
        t.codigo as 'Tanque Físico',
        tp.fecha_preparacion as 'Fecha Prep.',
        tp.litros_totales as 'Total (L)',
        tp.litros_disponibles as 'Disponible (L)',
        ROUND((tp.litros_disponibles / tp.litros_totales * 100), 1) as '% Disponible',
        GROUP_CONCAT(
            CONCAT(m.nombre, ': ', mt.cantidad_litros, 'L')
            ORDER BY mt.cantidad_litros DESC
            SEPARATOR ' | '
        ) as 'Mezclas',
        CASE 
            WHEN tp.litros_disponibles = 0 THEN 'VACÍO'
            WHEN tp.litros_disponibles < tp.litros_totales * 0.10 THEN 'CRÍTICO'
            WHEN tp.litros_disponibles < tp.litros_totales * 0.25 THEN 'BAJO'
            ELSE 'OK'
        END as 'Estado'
    FROM tanques_preparados tp
    INNER JOIN ranchos r ON tp.id_rancho = r.id
    INNER JOIN tanques t ON tp.id_tanque = t.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezclas m ON mt.id_mezcla = m.id
    GROUP BY tp.id
    ORDER BY tp.fecha_preparacion DESC, tp.codigo_tanque_preparado;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_mensual_rancho` (IN `p_anio` INT, IN `p_mes` INT, IN `p_id_rancho` INT)   BEGIN
    -- Sección 1: Resumen General del Rancho
    SELECT '=== RESUMEN GENERAL ===' as seccion;
    
    SELECT 
        r.rancho as 'Rancho',
        DATE_FORMAT(CONCAT(p_anio, '-', LPAD(p_mes, 2, '0'), '-01'), '%M %Y') as 'Periodo',
        COUNT(DISTINCT f.id) as 'Total Fertilizaciones',
        COUNT(DISTINCT s.id) as 'Sectores Fertilizados',
        ROUND(SUM(s.hectareas), 2) as 'Hectáreas Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) as 'Litros Totales Aplicados',
        COUNT(DISTINCT tp.id) as 'Tanques Utilizados'
    FROM ranchos r
    LEFT JOIN sectores s ON r.id = s.id_rancho
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector 
        AND YEAR(f.fecha) = p_anio 
        AND MONTH(f.fecha) = p_mes
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    WHERE r.id = p_id_rancho
    GROUP BY r.id, r.rancho;
    
    -- Sección 2: Fertilizaciones por Sector
    SELECT '=== FERTILIZACIONES POR SECTOR ===' as seccion;
    
    SELECT 
        s.sector_interno as 'Sector',
        s.variedad as 'Variedad',
        s.hectareas as 'Hectáreas',
        COUNT(f.id) as 'Num. Fertilizaciones',
        ROUND(s.hectareas * COUNT(f.id), 2) as 'Ha Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) as 'Litros Aplicados'
    FROM sectores s
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector 
        AND YEAR(f.fecha) = p_anio 
        AND MONTH(f.fecha) = p_mes
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    WHERE s.id_rancho = p_id_rancho
    GROUP BY s.id, s.sector_interno, s.variedad, s.hectareas
    HAVING COUNT(f.id) > 0
    ORDER BY s.sector_interno;
    
    -- Sección 3: NPK Aplicado (Solo principales)
    SELECT '=== CONSUMO NPK ===' as seccion;
    
    SELECT 
        a.nombre as 'Nutriente',
        ROUND(SUM(
            (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) 
            * (ma.porcentaje / 100)
        ), 2) as 'KG Aplicados',
        ROUND(SUM(s.hectareas), 2) as 'Hectáreas',
        ROUND(SUM(
            (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) 
            * (ma.porcentaje / 100)
        ) / SUM(s.hectareas), 2) as 'KG/Ha'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    INNER JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    INNER JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    INNER JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    INNER JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    INNER JOIN activo_mezcla a ON ma.id_activo = a.id
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio 
      AND MONTH(f.fecha) = p_mes
      AND a.es_principal = 1
    GROUP BY a.id, a.nombre
    ORDER BY a.nombre;
    
    -- Sección 4: Mezclas Utilizadas
    SELECT '=== MEZCLAS APLICADAS ===' as seccion;
    
    SELECT 
        m.nombre as 'Mezcla',
        COUNT(DISTINCT f.id) as 'Veces Aplicada',
        ROUND(SUM(dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales), 2) as 'Litros Aplicados'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    INNER JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    INNER JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    INNER JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    INNER JOIN mezclas m ON mt.id_mezcla = m.id
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio 
      AND MONTH(f.fecha) = p_mes
    GROUP BY m.id, m.nombre
    ORDER BY COUNT(DISTINCT f.id) DESC;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_por_variedad` (IN `p_anio` INT, IN `p_mes` INT)   BEGIN
    SELECT 
        s.variedad as 'Variedad',
        COUNT(DISTINCT s.id) as 'Num. Sectores',
        ROUND(SUM(s.hectareas), 2) as 'Hectáreas Totales',
        COUNT(DISTINCT f.id) as 'Fertilizaciones',
        ROUND(SUM(s.hectareas * 1), 2) as 'Ha Regadas',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'N (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'P (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'K (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(s.hectareas), 2) as 'N KG/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(s.hectareas), 2) as 'P KG/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(s.hectareas), 2) as 'K KG/Ha'
        
    FROM sectores s
    INNER JOIN fertilizaciones f ON s.id = f.id_sector
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE YEAR(f.fecha) = p_anio 
      AND MONTH(f.fecha) = p_mes
    GROUP BY s.variedad
    ORDER BY s.variedad;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_semanal_v2` (IN `p_anio` INT, IN `p_mes` INT)   BEGIN
    -- Reporte por sector
    SELECT 
        s.sector_interno AS 'Sector interno',
        s.sector_agrian AS 'Sector AGRIAN',
        s.variedad AS 'Variedad',
        s.hectareas AS 'Hectáreas',
        COUNT(DISTINCT f.id) AS 'Número de veces fertilizado',
        ROUND(s.hectareas * COUNT(DISTINCT f.id), 2) AS 'Suma de las hectáreas'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    WHERE YEAR(f.fecha) = p_anio
      AND MONTH(f.fecha) = p_mes
    GROUP BY s.id, s.sector_interno, s.sector_agrian, s.variedad, s.hectareas
    ORDER BY s.sector_interno;
    
    -- Total general
    SELECT 
        COUNT(DISTINCT f.id) AS 'Total Fertilizaciones',
        ROUND(SUM(s.hectareas * 1), 2) AS 'Total Hectáreas Regadas'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    WHERE YEAR(f.fecha) = p_anio 
      AND MONTH(f.fecha) = p_mes;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_resumen_anual` (IN `p_anio` INT)   BEGIN
    -- Totales del año
    SELECT 
        p_anio as 'Año',
        COUNT(DISTINCT f.id) as 'Total Fertilizaciones',
        COUNT(DISTINCT s.id) as 'Sectores Fertilizados',
        ROUND(SUM(s.hectareas), 2) as 'Hectáreas Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) as 'Litros Aplicados',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'N Total (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'P Total (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'K Total (KG)',
        
        ROUND(AVG(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100) / s.hectareas
            ELSE NULL END), 2) as 'N Promedio KG/Ha',
        
        ROUND(AVG(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100) / s.hectareas
            ELSE NULL END), 2) as 'P Promedio KG/Ha',
        
        ROUND(AVG(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100) / s.hectareas
            ELSE NULL END), 2) as 'K Promedio KG/Ha'
        
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE YEAR(f.fecha) = p_anio;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_resumen_anual_rancho_completo` (IN `p_anio` INT, IN `p_id_rancho` INT)   BEGIN
    DECLARE v_nombre_rancho VARCHAR(200);
    
    -- Obtener nombre del rancho
    SELECT rancho INTO v_nombre_rancho
    FROM ranchos
    WHERE id = p_id_rancho;
    
    -- =====================================================
    -- SECCIÓN 1: ENCABEZADO Y RESUMEN EJECUTIVO
    -- =====================================================
    SELECT CONCAT('========== RESUMEN ANUAL ', p_anio, ' - ', UPPER(v_nombre_rancho), ' ==========') AS '';
    
    SELECT 
        v_nombre_rancho AS 'Rancho',
        p_anio AS 'Año',
        COUNT(DISTINCT s.id) AS 'Total Sectores',
        ROUND(SUM(DISTINCT s.hectareas), 2) AS 'Hectáreas Totales',
        COUNT(DISTINCT f.id) AS 'Total Fertilizaciones',
        ROUND(SUM(s.hectareas * 1), 2) AS 'Hectáreas Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) AS 'Litros Aplicados',
        COUNT(DISTINCT tp.id) AS 'Tanques Utilizados',
        COUNT(DISTINCT m.id) AS 'Mezclas Usadas'
    FROM sectores s
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector AND YEAR(f.fecha) = p_anio
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezclas m ON mt.id_mezcla = m.id
    WHERE s.id_rancho = p_id_rancho;
    
    -- =====================================================
    -- SECCIÓN 2: CONSUMO NPK ANUAL DEL RANCHO
    -- =====================================================
    SELECT '========== CONSUMO NPK ANUAL ==========' AS '';
    
    SELECT 
        'NITRÓGENO (N)' AS 'Nutriente',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'KG Totales',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'KG/Ha Promedio'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio
    
    UNION ALL
    
    SELECT 
        'FÓSFORO (P2O5)' AS 'Nutriente',
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'KG Totales',
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'KG/Ha Promedio'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio
    
    UNION ALL
    
    SELECT 
        'POTASIO (K2O)' AS 'Nutriente',
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'KG Totales',
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'KG/Ha Promedio'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio;
    
    -- =====================================================
    -- SECCIÓN 3: DETALLE POR SECTOR
    -- =====================================================
    SELECT '========== DETALLE POR SECTOR ==========' AS '';
    
    SELECT 
        s.sector_interno AS 'Sector',
        s.sector_agrian AS 'Agrian',
        s.variedad AS 'Variedad',
        s.hectareas AS 'Ha',
        COUNT(DISTINCT f.id) AS 'Fertil.',
        ROUND(s.hectareas * COUNT(DISTINCT f.id), 2) AS 'Ha Reg.',
        ROUND(SUM(dft.litros_aplicados), 2) AS 'L Total',
        ROUND(AVG(dft.litros_aplicados) / s.hectareas, 2) AS 'L/Ha/Ap',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'N (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / s.hectareas, 2) AS 'N/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'P (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / s.hectareas, 2) AS 'P/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'K (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / s.hectareas, 2) AS 'K/Ha'
        
    FROM sectores s
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector AND YEAR(f.fecha) = p_anio
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE s.id_rancho = p_id_rancho
    GROUP BY s.id, s.sector_interno, s.sector_agrian, s.variedad, s.hectareas
    HAVING COUNT(DISTINCT f.id) > 0
    ORDER BY s.sector_interno;
    
    -- =====================================================
    -- SECCIÓN 4: DISTRIBUCIÓN MENSUAL
    -- =====================================================
    SELECT '========== DISTRIBUCIÓN MENSUAL ==========' AS '';
    
    SELECT 
        MONTHNAME(DATE(CONCAT(p_anio, '-', mes, '-01'))) AS 'Mes',
        COUNT(DISTINCT f.id) AS 'Fertilizaciones',
        COUNT(DISTINCT s.id) AS 'Sectores',
        ROUND(SUM(s.hectareas), 2) AS 'Ha Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) AS 'Litros',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'N (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'P (KG)',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'K (KG)'
        
    FROM (
        SELECT MONTH(f.fecha) AS mes
        FROM fertilizaciones f
        INNER JOIN sectores s ON f.id_sector = s.id
        WHERE s.id_rancho = p_id_rancho
          AND YEAR(f.fecha) = p_anio
        GROUP BY MONTH(f.fecha)
    ) meses
    LEFT JOIN fertilizaciones f ON MONTH(f.fecha) = meses.mes AND YEAR(f.fecha) = p_anio
    LEFT JOIN sectores s ON f.id_sector = s.id AND s.id_rancho = p_id_rancho
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    GROUP BY meses.mes
    ORDER BY meses.mes;
    
    -- =====================================================
    -- SECCIÓN 5: ANÁLISIS POR VARIEDAD
    -- =====================================================
    SELECT '========== ANÁLISIS POR VARIEDAD ==========' AS '';
    
    SELECT 
        s.variedad AS 'Variedad',
        COUNT(DISTINCT s.id) AS 'Sectores',
        ROUND(SUM(DISTINCT s.hectareas), 2) AS 'Hectáreas',
        COUNT(DISTINCT f.id) AS 'Fertilizaciones',
        ROUND(SUM(s.hectareas * 1), 2) AS 'Ha Regadas',
        
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'N (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'N KG/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'P (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'P2O5' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'P KG/Ha',
        
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) AS 'K (KG)',
        ROUND(SUM(CASE WHEN a.codigo = 'K2O' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END) / SUM(DISTINCT s.hectareas), 2) AS 'K KG/Ha'
        
    FROM sectores s
    LEFT JOIN fertilizaciones f ON s.id = f.id_sector AND YEAR(f.fecha) = p_anio
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.es_principal = 1
    WHERE s.id_rancho = p_id_rancho
    GROUP BY s.variedad
    HAVING COUNT(DISTINCT f.id) > 0
    ORDER BY s.variedad;
    
    -- =====================================================
    -- SECCIÓN 6: MEZCLAS MÁS UTILIZADAS
    -- =====================================================
    SELECT '========== MEZCLAS MÁS UTILIZADAS ==========' AS '';
    
    SELECT 
        m.nombre AS 'Mezcla',
        m.fabricante AS 'Fabricante',
        COUNT(DISTINCT f.id) AS 'Veces Usada',
        ROUND(SUM(dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales), 2) AS 'Litros Aplicados',
        ROUND(SUM(dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) / 
              SUM(SUM(dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales)) OVER() * 100, 1) AS '% del Total'
    FROM fertilizaciones f
    INNER JOIN sectores s ON f.id_sector = s.id
    INNER JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    INNER JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    INNER JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    INNER JOIN mezclas m ON mt.id_mezcla = m.id
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio
    GROUP BY m.id, m.nombre, m.fabricante
    ORDER BY COUNT(DISTINCT f.id) DESC
    LIMIT 10;
    
    -- =====================================================
    -- SECCIÓN 7: TOP 10 SECTORES MÁS FERTILIZADOS
    -- =====================================================
    SELECT '========== TOP 10 SECTORES MÁS FERTILIZADOS ==========' AS '';
    
    SELECT 
        s.sector_interno AS 'Sector',
        s.variedad AS 'Variedad',
        COUNT(DISTINCT f.id) AS 'Num. Fertilizaciones',
        s.hectareas AS 'Hectáreas',
        ROUND(s.hectareas * COUNT(DISTINCT f.id), 2) AS 'Ha Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) AS 'Litros Aplicados'
    FROM sectores s
    INNER JOIN fertilizaciones f ON s.id = f.id_sector
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    WHERE s.id_rancho = p_id_rancho
      AND YEAR(f.fecha) = p_anio
    GROUP BY s.id, s.sector_interno, s.variedad, s.hectareas
    ORDER BY COUNT(DISTINCT f.id) DESC
    LIMIT 10;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_top_sectores` (IN `p_anio` INT, IN `p_mes` INT, IN `p_limite` INT)   BEGIN
    SELECT 
        s.sector_interno as 'Sector',
        s.variedad as 'Variedad',
        r.rancho as 'Rancho',
        COUNT(f.id) as 'Fertilizaciones',
        ROUND(s.hectareas, 2) as 'Hectáreas',
        ROUND(s.hectareas * COUNT(f.id), 2) as 'Ha Regadas',
        ROUND(SUM(dft.litros_aplicados), 2) as 'Litros Aplicados',
        ROUND(SUM(CASE WHEN a.codigo = 'N' 
            THEN (dft.litros_aplicados * mt.cantidad_litros / tp.litros_totales) * (ma.porcentaje / 100)
            ELSE 0 END), 2) as 'N (KG)'
    FROM sectores s
    INNER JOIN ranchos r ON s.id_rancho = r.id
    INNER JOIN fertilizaciones f ON s.id = f.id_sector
    LEFT JOIN detalle_fertilizacion_tanques dft ON f.id = dft.id_fertilizacion
    LEFT JOIN tanques_preparados tp ON dft.id_tanque_preparado = tp.id
    LEFT JOIN mezclas_tanque mt ON tp.id = mt.id_tanque_preparado
    LEFT JOIN mezcla_activos ma ON mt.id_mezcla = ma.id_mezcla
    LEFT JOIN activo_mezcla a ON ma.id_activo = a.id AND a.codigo = 'N'
    WHERE YEAR(f.fecha) = p_anio 
      AND MONTH(f.fecha) = p_mes
    GROUP BY s.id, s.sector_interno, s.variedad, s.hectareas, r.rancho
    ORDER BY COUNT(f.id) DESC
    LIMIT p_limite;
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activo_mezcla`
--

CREATE TABLE `activo_mezcla` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `es_principal` tinyint(1) NOT NULL,
  `unidad` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `activo_mezcla`
--

INSERT INTO `activo_mezcla` (`id`, `nombre`, `codigo`, `tipo`, `es_principal`, `unidad`) VALUES
(1, 'Nitrógeno', 'N', 'MACRO', 1, 'Litro'),
(2, 'Fósforo', 'P2O5', 'MACRO', 1, 'Litro'),
(3, 'Potasio', 'K2O', 'MACRO', 1, 'Litro'),
(4, 'Calcio', 'Ca', 'SECUNDARIO', 0, 'Litro'),
(5, 'Magnesio', 'Mg', 'SECUNDARIO', 0, 'Litro'),
(6, 'Azufre', 'S', 'SECUNDARIO', 0, 'Litro'),
(7, 'Hierro', 'Fe', 'MICRO', 0, 'Litro'),
(8, 'Zinc', 'Zn', 'MICRO', 0, 'Litro'),
(9, 'Manganeso', 'Mn', 'MICRO', 0, 'Litro'),
(10, 'Cobre', 'Cu', 'MICRO', 0, 'Litro'),
(11, 'Boro', 'B', 'MICRO', 0, 'Litro'),
(12, 'Molibdeno', 'Mo', 'MICRO', 0, 'Litro'),
(13, 'Aminoácidos', 'aminoacidos', 'BIOESTIMULANTE', 0, 'Litro'),
(14, 'Ácidos húmicos', 'acidos humicos', 'BIOESTIMULANTE', 0, 'Litro'),
(15, 'Extractos de algas', 'extractos de algas', 'BIOESTIMULANTE', 0, 'Litro'),
(16, 'Ácidos fúlvicos', 'acidos fulvicos', 'BIOESTIMULANTE', 0, 'Litro'),
(17, 'Enzimas', 'enzimas', 'BIOESTIMULANTE', 0, 'Litro'),
(18, 'Quitosano', 'quitosano', 'BIOESTIMULANTE', 0, 'Litro'),
(19, 'Surfactantes', 'surfactantes', 'COADYUVANTE', 0, 'Litro'),
(20, 'Humectantes', 'humectantes', 'COADYUVANTE', 0, 'Litro'),
(21, 'Dispersantes', 'dispersantes', 'COADYUVANTE', 0, 'Litro'),
(22, 'Antiespumantes', 'antiespumantes', 'COADYUVANTE', 0, 'Litro'),
(23, 'Adherentes', 'adherentes', 'COADYUVANTE', 0, 'Litro'),
(24, 'Cloro', 'CI', 'SECUNDARIO', 0, 'Litro'),
(25, 'Aminoácidos Libres', 'aminoacidos libres', 'BIOESTIMULANTE', 0, 'Litro'),
(26, 'Aminoácidos Totales', 'aminoacidos totales', 'BIOESTIMULANTE', 0, 'Litro'),
(27, 'Materia Organica', 'materia organica', 'BIOESTIMULANTE', 0, 'Litro'),
(28, 'Microorganismos', 'Microorganismos', 'BIOLOGICOS', 0, 'Litro'),
(29, 'Complejo vitamínico', 'Complejo vitamínico', 'BIOLOGICOS', 0, 'Litro'),
(30, 'Nutrientes y macronutrientes', 'Nutrientes y macronu', 'BIOLOGICOS', 0, 'Litro'),
(31, 'Vehículo fijador', 'Vehículo fijador', 'BIOLOGICOS', 0, 'Litro'),
(32, 'Sulfato de calcio dihidratado', 'Sulfato de calcio di', 'BIOLOGICOS', 0, 'Litro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aplicaciones_tanque`
--

CREATE TABLE `aplicaciones_tanque` (
  `id` int(11) NOT NULL,
  `id_tanque_preparado` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `id_responsable` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `litros_aplicados` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_fertilizacion_tanques`
--

CREATE TABLE `detalle_fertilizacion_tanques` (
  `id` int(11) NOT NULL,
  `id_fertilizacion` int(11) NOT NULL,
  `id_tanque_preparado` int(11) NOT NULL,
  `litros_aplicados` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `detalle_fertilizacion_tanques`
--

INSERT INTO `detalle_fertilizacion_tanques` (`id`, `id_fertilizacion`, `id_tanque_preparado`, `litros_aplicados`) VALUES
(1, 1, 7, 1000.00),
(2, 2, 8, 1000.00),
(3, 3, 9, 1000.00),
(4, 4, 9, 300.00),
(5, 5, 7, 400.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `razon_social` varchar(200) NOT NULL,
  `nombre_comercial` varchar(200) NOT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id`, `razon_social`, `nombre_comercial`, `rfc`, `status`) VALUES
(1, 'Moras Finas de sv de cv', 'Moras Finas', '1W3R5Y7U8I9O0', 1),
(2, 'Bayas Del Centro de sv de cv', 'Bayas del Centro', '1W2E4R5T6Y7U8', 1),
(3, 'Bioagricultura de sv de cv', 'Bioagricultura', '1Q2W3E4R5T6Y7', 1),
(4, 'Lugar Agricola de sv de cv', 'Lugar Agricola', '0PO98IU76YT5R', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fertilizaciones`
--

CREATE TABLE `fertilizaciones` (
  `id` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `id_responsable` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `temporada` varchar(100) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `fertilizaciones`
--

INSERT INTO `fertilizaciones` (`id`, `id_sector`, `id_responsable`, `fecha`, `temporada`, `observaciones`, `status`) VALUES
(1, 137, 54, '2026-04-13', 'Julio25-Junio26', 'Fertilización automática', 1),
(2, 96, 54, '2026-04-13', 'Julio25-Junio26', 'Fertilización automática', 1),
(3, 312, 54, '2026-04-13', 'Julio25-Junio26', 'Fertilización automática', 1),
(4, 306, 54, '2026-04-13', 'Julio25-Junio26', 'Fertilización automática', 1),
(5, 153, 54, '2026-04-13', 'Julio24-Junio25', 'Fertilización automática', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fertilizacion_activos`
--

CREATE TABLE `fertilizacion_activos` (
  `id` int(11) NOT NULL,
  `id_fertilizacion` int(11) NOT NULL,
  `id_activo` int(11) NOT NULL,
  `cantidad_aplicada` decimal(12,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `fertilizacion_activos`
--

INSERT INTO `fertilizacion_activos` (`id`, `id_fertilizacion`, `id_activo`, `cantidad_aplicada`) VALUES
(1, 1, 1, 27.020833),
(2, 1, 2, 34.541667),
(3, 1, 3, 9.916667),
(4, 1, 4, 0.743750),
(5, 1, 5, 1.645833),
(6, 1, 7, 0.072917),
(7, 1, 8, 20.845000),
(8, 1, 9, 0.009167),
(9, 1, 13, 5.208333),
(10, 1, 25, 24.895833),
(11, 1, 26, 34.708333),
(12, 1, 27, 225.229167),
(13, 2, 1, 14.280000),
(14, 2, 2, 9.520000),
(15, 2, 3, 9.520000),
(16, 2, 4, 1.428000),
(17, 2, 5, 3.160000),
(18, 2, 7, 0.140000),
(19, 2, 8, 0.022400),
(20, 2, 9, 0.017600),
(21, 2, 13, 64.000000),
(22, 2, 14, 38.400000),
(23, 2, 25, 14.280000),
(24, 2, 26, 66.640000),
(25, 2, 27, 138.040000),
(26, 3, 1, 23.282609),
(27, 3, 2, 15.521739),
(28, 3, 3, 15.521739),
(29, 3, 4, 2.328261),
(30, 3, 5, 5.152174),
(31, 3, 7, 0.228261),
(32, 3, 8, 0.036522),
(33, 3, 9, 0.028696),
(34, 3, 25, 23.282609),
(35, 3, 26, 108.652174),
(36, 3, 27, 225.065217),
(37, 3, 32, 210.869565),
(38, 4, 1, 6.984783),
(39, 4, 2, 4.656522),
(40, 4, 3, 4.656522),
(41, 4, 4, 0.698478),
(42, 4, 5, 1.545652),
(43, 4, 7, 0.068478),
(44, 4, 8, 0.010957),
(45, 4, 9, 0.008609),
(46, 4, 25, 6.984783),
(47, 4, 26, 32.595652),
(48, 4, 27, 67.519565),
(49, 4, 32, 63.260870),
(50, 5, 1, 10.808333),
(51, 5, 2, 13.816667),
(52, 5, 3, 3.966667),
(53, 5, 4, 0.297500),
(54, 5, 5, 0.658333),
(55, 5, 7, 0.029167),
(56, 5, 8, 8.338000),
(57, 5, 9, 0.003667),
(58, 5, 13, 2.083333),
(59, 5, 25, 9.958333),
(60, 5, 26, 13.883333),
(61, 5, 27, 90.091667);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mesclas_preparacion_tamque`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mesclas_preparacion_tamque` (
`id` int(11)
,`id_tanque_preparado` int(11)
,`litros_totales_tanque` decimal(10,2)
,`codigo_tanque_preparado` varchar(30)
,`fecha_preparacion` date
,`anio` int(4)
,`mes` int(2)
,`mezcla` varchar(30)
,`cantidad_mezcla` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mezclas`
--

CREATE TABLE `mezclas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `fabricante` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `mezclas`
--

INSERT INTO `mezclas` (`id`, `nombre`, `fabricante`, `descripcion`) VALUES
(1, 'M&T 3-2-2', 'M&T Organics', ''),
(11, 'M&T 4-6-1', 'Mar y Tierra Fertilzantes Orgánicos S.A. de C.V.', ''),
(12, 'OBA Arranque y Desarrollo', 'Lola Berries S.P.R. de R.L. de C.V.', ''),
(13, 'Diamond K Premium 97 ', 'Diamond K Gypsum', ''),
(14, 'GreenBack SUPORG', 'Comercializadora GreenHow S.A de C.V', ''),
(15, 'M&T Zn', 'Mar y Tierra Fertilizantes Orgánicos S.A. de C.V.', ''),
(25, 'M&T Fe', 'Mar Y Tierra OrgáNicos Fertilizantes S.A De C.V.', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mezclas_tanque`
--

CREATE TABLE `mezclas_tanque` (
  `id` int(11) NOT NULL,
  `id_tanque_preparado` int(11) NOT NULL,
  `id_mezcla` int(11) NOT NULL,
  `cantidad_litros` decimal(10,2) NOT NULL COMMENT 'Litros de esta mezcla en el tanque'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `mezclas_tanque`
--

INSERT INTO `mezclas_tanque` (`id`, `id_tanque_preparado`, `id_mezcla`, `cantidad_litros`) VALUES
(17, 7, 1, 500.00),
(18, 7, 11, 1000.00),
(19, 7, 15, 500.00),
(20, 8, 1, 1000.00),
(21, 8, 14, 800.00),
(22, 9, 1, 1500.00),
(23, 9, 13, 500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mezcla_activos`
--

CREATE TABLE `mezcla_activos` (
  `id` int(11) NOT NULL,
  `id_mezcla` int(11) NOT NULL,
  `id_activo` int(11) NOT NULL,
  `porcentaje` decimal(10,4) DEFAULT NULL COMMENT 'Porcentaje del activo en la mezcla'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `mezcla_activos`
--

INSERT INTO `mezcla_activos` (`id`, `id_mezcla`, `id_activo`, `porcentaje`) VALUES
(30, 1, 1, 3.5700),
(31, 1, 2, 2.3800),
(32, 1, 3, 2.3800),
(33, 1, 27, 34.5100),
(34, 1, 25, 3.5700),
(35, 1, 26, 16.6600),
(36, 1, 5, 0.7900),
(37, 1, 8, 0.0056),
(38, 1, 9, 0.0044),
(39, 1, 4, 0.3570),
(40, 1, 7, 0.0350),
(41, 11, 1, 4.7000),
(42, 11, 2, 7.1000),
(43, 11, 3, 1.1900),
(44, 11, 27, 33.3000),
(45, 11, 25, 4.1900),
(46, 12, 1, 5.0000),
(47, 12, 2, 5.0000),
(48, 12, 3, 2.0000),
(49, 13, 32, 97.0000),
(50, 15, 13, 2.5000),
(51, 15, 8, 10.0000),
(52, 15, 27, 7.0000),
(53, 25, 13, 2.5000),
(54, 25, 1, 1.0000),
(55, 25, 7, 5.0000),
(56, 25, 27, 7.0000),
(60, 14, 14, 12.0000),
(61, 14, 13, 20.0000);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `npk_fertilizacion_completo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `npk_fertilizacion_completo` (
`fertilizacion_id` int(11)
,`fecha` date
,`anio` int(4)
,`mes` int(2)
,`temporada` varchar(100)
,`id_sector` int(11)
,`sector_interno` varchar(20)
,`variedad` varchar(30)
,`hectareas` float
,`id_empresa` int(11)
,`razon_social` varchar(200)
,`id_rancho` int(11)
,`rancho` varchar(200)
,`id_rancho_dsa` int(11)
,`nombre_rancho_dsa` varchar(100)
,`codigo_tanque_preparado` varchar(30)
,`litros_aplicados` decimal(10,2)
,`N_kg` decimal(31,2)
,`P_kg` decimal(31,2)
,`K_kg` decimal(31,2)
,`N_kg_ha` double(19,2)
,`P_kg_ha` double(19,2)
,`K_kg_ha` double(19,2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ranchos`
--

CREATE TABLE `ranchos` (
  `id` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `rancho` varchar(200) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `ranchos`
--

INSERT INTO `ranchos` (`id`, `id_empresa`, `rancho`, `status`) VALUES
(1, 2, 'Ojo De Agua', 1),
(2, 2, 'Zapote', 1),
(3, 2, 'La Loma', 1),
(4, 1, 'Ario', 1),
(5, 1, 'Guzman', 1),
(6, 1, 'Santiaguillo', 1),
(7, 1, 'Casas De Altos', 1),
(8, 1, 'Paraiso', 1),
(9, 1, 'Presa', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rancho_dsa`
--

CREATE TABLE `rancho_dsa` (
  `id` int(11) NOT NULL,
  `id_rancho` int(11) NOT NULL,
  `nombre_rancho_dsa` varchar(100) NOT NULL,
  `numero_rancho_dsa` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `rancho_dsa`
--

INSERT INTO `rancho_dsa` (`id`, `id_rancho`, `nombre_rancho_dsa`, `numero_rancho_dsa`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, '7 Ario Rasp 2024', 19842, 1, '2026-03-12 20:08:09', '2026-03-12 20:08:09'),
(2, 4, '8 Ario Rasp 2025', 21182, 1, '2026-03-12 20:08:44', '2026-03-12 20:08:44'),
(3, 5, '1Guzman Rasp ', 21183, 1, '2026-03-12 20:09:05', '2026-03-12 20:09:05'),
(4, 6, 'G1Santiaguillo Rasp 2025', 21184, 1, '2026-03-12 20:09:30', '2026-03-12 20:09:30'),
(5, 9, 'Presa Rasp 2024', 19843, 1, '2026-03-12 20:11:26', '2026-03-12 20:11:26'),
(6, 7, 'Casas de altos', 16858, 1, '2026-03-12 20:11:52', '2026-03-12 20:11:52'),
(7, 8, '1 Paraíso', 14653, 1, '2026-03-12 20:12:30', '2026-03-12 20:12:30'),
(8, 1, 'Ojo de agua Org', 11711, 1, '2026-03-12 20:12:51', '2026-03-12 20:12:51'),
(9, 2, '2A Zapote (Trans)', 19867, 1, '2026-03-12 20:13:31', '2026-03-12 20:13:31'),
(10, 2, '1A Zapote Org', 13215, 1, '2026-03-12 20:13:52', '2026-03-12 20:13:52'),
(11, 2, '1B Zapote Org', 13216, 1, '2026-03-12 20:14:16', '2026-03-12 20:14:16'),
(12, 2, '1C Zapote Org', 13217, 1, '2026-03-12 20:14:42', '2026-03-12 20:14:42'),
(13, 3, 'Zloma Org', 14382, 1, '2026-03-12 20:15:13', '2026-03-12 20:15:13');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `reporte_mezclas_aplicadas_rancho_mes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `reporte_mezclas_aplicadas_rancho_mes` (
`id` int(11)
,`rancho` varchar(200)
,`anio` int(4)
,`mes` int(2)
,`id_mezcla` int(11)
,`mezcla` varchar(30)
,`veces_aplicada` bigint(21)
,`total_litros_aplicados` decimal(48,8)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `resumen_anual_sector_rancho`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `resumen_anual_sector_rancho` (
`id_rancho` int(11)
,`Rancho` varchar(200)
,`id_sector` int(11)
,`Sector` varchar(20)
,`Agrian` varchar(20)
,`Variedad` varchar(30)
,`Hectáreas` float
,`anio` int(4)
,`Total Fertilizaciones` bigint(21)
,`Ha Regadas Totales` double(19,2)
,`Ene` bigint(21)
,`Feb` bigint(21)
,`Mar` bigint(21)
,`Abr` bigint(21)
,`May` bigint(21)
,`Jun` bigint(21)
,`Jul` bigint(21)
,`Ago` bigint(21)
,`Sep` bigint(21)
,`Oct` bigint(21)
,`Nov` bigint(21)
,`Dic` bigint(21)
,`Litros Aplicados` decimal(32,2)
,`Litros Prom/Aplic` decimal(33,2)
,`Litros/Ha Anual` double(19,2)
,`N Total (KG)` decimal(31,2)
,`P Total (KG)` decimal(31,2)
,`K Total (KG)` decimal(31,2)
,`N KG/Ha Anual` double(19,2)
,`P KG/Ha Anual` double(19,2)
,`K KG/Ha Anual` double(19,2)
,`N KG/Aplic Prom` decimal(31,2)
,`P KG/Aplic Prom` decimal(31,2)
,`K KG/Aplic Prom` decimal(31,2)
,`N Dosis/Ha/Aplic` double(19,2)
,`P Dosis/Ha/Aplic` double(19,2)
,`K Dosis/Ha/Aplic` double(19,2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `rol_name` varchar(30) NOT NULL,
  `rol_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sectores`
--

CREATE TABLE `sectores` (
  `id` int(11) NOT NULL,
  `id_rancho_dsa` int(11) DEFAULT NULL,
  `sector_interno` varchar(20) NOT NULL,
  `sector_agrian` varchar(20) NOT NULL,
  `variedad` varchar(30) NOT NULL,
  `hectareas` float NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `sectores`
--

INSERT INTO `sectores` (`id`, `id_rancho_dsa`, `sector_interno`, `sector_agrian`, `variedad`, `hectareas`, `status`) VALUES
(9, 1, 'Cañas 1.1', '01', 'Marilyn', 0.43, 1),
(10, 1, 'Cañas 1.2', '02', 'Marilyn', 0.53, 1),
(11, 1, 'Cañas 2.1', '03', 'Marilyn', 0.48, 1),
(12, 1, 'Cañas 2.2', '04', 'Marilyn', 0.46, 1),
(13, 1, 'Cañas 3.1', '05', 'Marilyn', 0.66, 1),
(14, 1, 'Cañas 3.2', '06', 'Marilyn', 0.57, 1),
(15, 1, 'Cañas 4.1', '07', 'Mya', 0.63, 1),
(16, 1, 'Cañas 4.2', '08', 'Marilyn', 0.69, 1),
(17, 1, 'Cañas 5.1', '09', 'Mya', 0.74, 1),
(18, 1, 'Cañas 5.2', '10', 'Mya', 0.7, 1),
(19, 1, 'Cañas 6.1', '11', 'Mya', 0.38, 1),
(20, 1, 'Cañas 6.2', '12', 'Mya', 0.43, 1),
(21, 1, 'Cañas 7.1', '13', 'Mya', 0.44, 1),
(22, 1, 'Cañas 7.2', '14', 'Mya', 0.51, 1),
(23, 1, 'L 1.1', '15', 'Mya', 0.63, 1),
(24, 1, 'L 1.2', '16', 'Mya', 0.64, 1),
(25, 1, 'L 1.3', '17', 'Mya', 0.57, 1),
(26, 1, 'L 2.1', '18', 'Mya', 0.42, 1),
(27, 1, 'L 2.2', '19', 'Mya', 0.45, 1),
(28, 1, 'L 2.3', '20', 'Mya', 0.48, 1),
(29, 1, 'L 3.1', '21', 'Mya', 0.4, 1),
(30, 1, 'L 3.2', '22', 'Mya', 0.47, 1),
(31, 1, 'L 4.1', '23', 'Mya', 0.33, 1),
(32, 1, 'L 4.2', '24', 'Mya', 0.26, 1),
(33, 1, 'Hormigas 1.1', '25', 'Mya', 0.5, 1),
(34, 1, 'Hormigas 1.2', '26', 'Mya', 0.6, 1),
(35, 1, 'Hormigas 1.3', '27', 'Mya', 0.61, 1),
(36, 1, 'Hormigas 1.4', '28', 'Mya', 0.61, 1),
(37, 1, 'Hormigas 2.1', '29', 'Mya', 0.6, 1),
(38, 1, 'Hormigas 2.2', '30', 'Mya', 0.63, 1),
(39, 1, 'Hormigas 2.3', '31', 'Mya', 0.6, 1),
(40, 1, 'Hormigas 2.4', '32', 'Mya', 0.59, 1),
(41, 1, 'Alemán II (3.1)', '33', 'Mya', 0.87, 1),
(42, 1, 'Alemán II (3.2)', '34', 'Mya', 0.74, 1),
(43, 1, 'Alemán I (1.1)', '35', 'Mya', 0.85, 1),
(44, 1, 'Alemán I (1.2)', '36', 'Mya', 0.83, 1),
(45, 1, 'Alemán I (2.1)', '37', 'Mya', 0.83, 1),
(46, 1, 'Alemán I (2.2)', '38', 'Mya', 0.86, 1),
(47, 1, 'Ladera A', '39', 'Mya', 0.66, 1),
(48, 1, 'Ladera B', '40', 'Mya', 0.32, 1),
(49, 1, 'Ladera C', '41', 'Mya', 0.9, 1),
(50, 1, 'Ladera D', '42', 'Mya', 0.31, 1),
(51, 1, 'Ladera E', '43', 'Mya', 0.8, 1),
(52, 1, 'Ladera F', '44', 'Mya', 0.51, 1),
(53, 1, 'Ladera G', '45', 'Mya', 0.27, 1),
(54, 1, 'Ladera H', '46', 'Mya', 0.28, 1),
(55, 1, 'Ladera I', '47', 'Mya', 0.23, 1),
(56, 1, 'Ladera J', '48', 'Mya', 0.27, 1),
(57, 1, 'Ladera K', '49', 'Mya', 0.11, 1),
(58, 2, 'Esteban 1.1', '01', 'Marilyn', 0.88, 1),
(59, 2, 'Esteban 1.2', '02', 'Marilyn', 0.81, 1),
(60, 2, 'Esteban 2.1', '03', 'Marilyn', 0.85, 1),
(61, 2, 'Esteban 2.2', '04', 'Marilyn', 0.76, 1),
(62, 2, 'Esteban 3.1', '05', 'Marilyn', 0.87, 1),
(63, 2, 'Esteban 3.2', '06', 'Marilyn', 0.94, 1),
(64, 2, 'Mercedes 1', '07', 'Mya', 0.91, 1),
(65, 2, 'Mercedes 2', '08', 'Mya', 1.34, 1),
(66, 2, 'Mercedes 3', '09', 'Mya', 1, 1),
(67, 2, 'Mercedes 4', '10', 'Mya', 1.16, 1),
(68, 2, 'Llano 1.1', '11', 'Mya', 1.04, 1),
(69, 2, 'Llano 1.2', '12', 'Mya', 1.08, 1),
(70, 2, 'Llano 2.1', '13', 'Mya', 1.12, 1),
(71, 2, 'Llano 2.2', '14', 'Mya', 1.23, 1),
(72, 2, 'Llano 3.1', '15', 'Mya', 1.06, 1),
(73, 2, 'Llano 3.2', '16', 'Mya', 1.29, 1),
(74, 2, 'En medio 1.1', '17', 'Mya', 0.6, 1),
(75, 2, 'En medio 1.2', '18', 'Mya', 0.97, 1),
(76, 2, 'En medio 2.1', '19', 'Mya', 0.46, 1),
(77, 2, 'En medio 2.2', '20', 'Mya', 0.61, 1),
(78, 2, 'En medio 3.1', '21', 'Mya', 0.54, 1),
(79, 2, 'En medio 3.2', '22', 'Mya', 0.4, 1),
(80, 2, 'En medio 4.1', '23', 'Mya', 0.51, 1),
(81, 2, 'En medio 4.2', '24', 'Mya', 0.38, 1),
(82, 2, 'Alemán II (1.1)', '25', 'Mya', 0.75, 1),
(83, 2, 'Alemán II (1.2)', '26', 'Mya', 0.77, 1),
(84, 2, 'Alemán II (2.1)', '27', 'Mya', 0.83, 1),
(85, 2, 'Alemán II (2.2)', '28', 'Mya', 0.78, 1),
(86, 2, 'Luna 1', '29', 'Mya', 0.55, 1),
(87, 2, 'Luna 2', '30', 'Mya', 0.42, 1),
(88, 2, 'Luna 2.1', '31', 'Mya', 0.42, 1),
(89, 2, 'Sauz 1', '32', 'Mya', 1.06, 1),
(90, 2, 'Sauz 2', '33', 'Mya', 1.27, 1),
(91, 2, 'Sauz 3', '34', 'Mya', 1.09, 1),
(92, 2, 'Sauz 4', '35', 'Mya', 0.87, 1),
(93, 2, 'Sauz 5', '36', 'Mya', 0.74, 1),
(94, 3, 'Guzmán 4.2', '24', 'Mya', 0.47, 1),
(95, 3, 'Guzmán 6.1', '25', 'Mya', 1.33, 1),
(96, 3, 'Guzmán 6.2', '26', 'Mya', 0.59, 1),
(97, 3, 'Guzmán 7.1', '27', 'Mya', 0.92, 1),
(98, 3, 'Guzmán 7.2', '28', 'Mya', 0.96, 1),
(99, 3, 'Guzmán 8.1', '29', 'Mya', 0.85, 1),
(100, 3, 'Guzmán 8.2', '30', 'Mya', 0.5, 1),
(101, 4, 'Pino 1.2', '01', 'Mya', 0.83, 1),
(102, 4, 'Pino 1.3', '02', 'Mya', 0.93, 1),
(103, 4, 'Pino 1.4', '03', 'Mya', 0.89, 1),
(104, 4, 'Mujeres 1.1', '04', 'Marilyn', 0.87, 1),
(105, 4, 'Mujeres 1.2', '05', 'Marilyn', 0.83, 1),
(106, 4, 'Mujeres 2.1', '06', 'Mya', 0.93, 1),
(107, 4, 'Mujeres 2.2', '07', 'Mya', 1.05, 1),
(108, 4, 'Mujeres 2.3', '08', 'Mya', 0.48, 1),
(109, 4, 'Mujeres 3.1', '09', 'Mya', 1, 1),
(110, 4, 'Mujeres 3.2', '10', 'Mya', 0.69, 1),
(111, 5, 'Presa 1.1', '01', 'Marilyn', 0.56, 1),
(112, 5, 'Presa 1.2', '02', 'Marilyn', 0.6, 1),
(113, 5, 'Presa 2.1', '03', 'Marilyn', 0.58, 1),
(114, 5, 'Presa 2.2', '04', 'Marilyn', 0.59, 1),
(115, 5, 'Presa 3.1', '05', 'Marilyn', 0.58, 1),
(116, 5, 'Presa 3.2', '06', 'Marilyn', 0.64, 1),
(117, 5, 'Presa 4.1', '07', 'Mya', 0.65, 1),
(118, 5, 'Presa 4.2', '08', 'Mya', 0.71, 1),
(119, 5, 'Presa 5.1', '09', 'Mya', 0.72, 1),
(120, 5, 'Presa 5.2', '10', 'Mya', 0.66, 1),
(121, 5, 'Presa 6.1', '11', 'Mya', 0.94, 1),
(122, 5, 'Presa 6.2', '12', 'Mya', 0.47, 1),
(123, 5, 'Presa 7.1', '13', 'Mya', 0.79, 1),
(124, 5, 'Presa 7.2', '14', 'Mya', 0.58, 1),
(125, 5, 'Presa 8.1', '15', 'Mya', 0.77, 1),
(126, 5, 'Presa 8.2', '16', 'Mya', 0.56, 1),
(127, 5, 'Presa 9.1', '17', 'Mya', 0.56, 1),
(128, 5, 'Presa 9.2', '18', 'Mya', 0.48, 1),
(129, 5, 'Presa 10.1', '19', 'Mya', 0.16, 1),
(130, 5, 'Presa 10.2', '20', 'Mya', 0.28, 1),
(131, 5, 'Rincón 1', '21', 'Mya', 1.1, 1),
(132, 5, 'Rincón 2', '22', 'Mya', 1.16, 1),
(133, 5, 'Rincón 3', '23', 'Mya', 1.13, 1),
(134, 5, 'Rincón 4', '24', 'Mya', 1.16, 1),
(135, 5, 'Rincón 5', '25', 'Mya', 1.04, 1),
(136, 5, 'Rincón 6', '26', 'Mya', 0.85, 1),
(137, 6, '01', '01', 'Rebeca', 0.54, 1),
(138, 6, '01', '02', 'Rebeca', 0.3, 1),
(139, 6, '02', '03', 'Rebeca', 0.71, 1),
(140, 6, '02', '04', 'Rebeca', 0.53, 1),
(141, 6, '03', '05', 'Rebeca', 0.7, 1),
(142, 6, '03', '06', 'Rebeca', 0.51, 1),
(143, 6, '04', '07', 'Rebeca', 0.68, 1),
(144, 6, '04', '08', 'Rebeca', 0.58, 1),
(145, 6, '05', '09', 'Rebeca', 0.67, 1),
(146, 6, '05', '10', 'Rebeca', 0.53, 1),
(147, 6, '06', '11', 'Rebeca', 0.66, 1),
(148, 6, '06', '12', 'Rebeca', 0.66, 1),
(149, 6, '07', '13', 'Rebeca', 0.62, 1),
(150, 6, '07', '14', 'Rebeca', 0.69, 1),
(151, 6, '08', '15', 'Rebeca', 0.61, 1),
(152, 6, '08', '16', 'Rebeca', 0.7, 1),
(153, 6, '09', '17', 'Rebeca', 0.44, 1),
(154, 6, '09', '18', 'Rebeca', 0.67, 1),
(155, 7, 'Chiquera 1.1', '01', 'Elvira', 0.63, 1),
(156, 7, 'Chiquera 2.1', '02', 'Elvira', 0.63, 1),
(157, 7, 'Chiquera 3.1', '03', 'Normita', 0.64, 1),
(158, 7, 'Chiquera 3.2', '04', 'Normita', 0.59, 1),
(159, 7, 'Huerta 1.1', '05', 'Normita', 0.58, 1),
(160, 7, 'Huerta 1.2', '06', 'Normita', 0.59, 1),
(161, 7, 'Huerta 1.3', '07', 'Sector en descanso', 0, 0),
(162, 7, 'Huerta 1.4', '08', 'Sector en descanso', 0, 0),
(163, 7, 'Huerta 2.1', '09', 'Rebeca', 0.57, 1),
(164, 7, 'Huerta 2.2', '10', 'Rebeca', 0.64, 1),
(165, 7, 'Huerta 2.3', '11', 'Rebeca', 0.62, 1),
(166, 7, 'Huerta 2.4', '12', 'Rebeca', 0.68, 1),
(167, 7, 'Huerta 3.1', '13', 'Sector en descanso', 0, 0),
(168, 7, 'Huerta 3.2', '14', 'Sector en descanso', 0, 0),
(169, 7, 'Huerta 3.3', '15', 'Sector en descanso', 0, 0),
(170, 7, 'Huerta 3.4', '16', 'Sector en descanso', 0, 0),
(171, 7, 'Majadas 1.1', '17', 'Elvira', 0.42, 1),
(172, 7, 'Majadas 1.2', '18', 'Elvira', 0.61, 1),
(173, 7, 'Majadas 1.3', '19', 'Elvira', 0.36, 1),
(174, 7, 'Majadas 1.4', '20', 'Sector en descanso', 0, 0),
(175, 7, 'Majadas 1.5', '21', 'Sector en descanso', 0, 0),
(176, 7, 'Majadas 1.6', '22', 'Rebeca', 0.38, 1),
(177, 7, 'Majadas 2.1', '23', 'Elvira', 0.31, 1),
(178, 7, 'Majadas 2.2', '24', 'Elvira', 0.58, 1),
(179, 7, 'Majadas 2.3', '25', 'Elvira', 0.38, 1),
(180, 7, 'Majadas 2.4', '26', 'Sector en descanso', 0, 0),
(181, 7, 'Majadas 2.5', '27', 'Sector en descanso', 0, 0),
(182, 7, 'Majadas 2.6', '28', 'Rebeca', 0.37, 1),
(183, 7, 'Pozo 1.1', '29', 'Rebeca', 1.14, 1),
(184, 7, 'Pozo 1.2', '30', 'Rebeca', 1.08, 1),
(185, 7, 'Pozo 2.1', '31', 'Rebeca', 1, 1),
(186, 7, 'Pozo 2.2', '32', 'Rebeca', 1.02, 1),
(187, 7, 'Pozo 3.1', '33', 'Normita', 0.81, 1),
(188, 7, 'Pozo 3.2', '34', 'Sector en descanso', 0, 0),
(189, 7, 'Chiquera 1.2', '35', 'Normita', 0.69, 1),
(190, 7, 'Chiquera 1.3', '36', 'Normita', 0.59, 1),
(191, 7, 'Chiquera 1.4', '37', 'Normita', 0.64, 1),
(192, 7, 'Chiquera 2.2', '38', 'Sector en descanso', 0, 0),
(193, 7, 'Chiquera 2.3', '39', 'Sector en descanso', 0, 0),
(194, 7, 'Chiquera 2.4', '40', 'Sector en descanso', 0, 0),
(195, 7, 'Chiquera 3.1', '41', 'Sector en descanso', 0, 0),
(196, 7, 'Chiquera 3.4', '42', 'Sector en descanso', 0, 0),
(197, 7, 'Caseta 1.1', '43', 'Sector en descanso', 0, 0),
(198, 7, 'Caseta 1.2', '44', 'Sector en descanso', 0, 0),
(199, 7, 'Caseta 2.1', '45', 'Sector en descanso', 0, 0),
(200, 7, 'Caseta 2.2', '46', 'Sector en descanso', 0, 0),
(201, 7, 'Caseta 3.1', '47', 'Sector en descanso', 0, 0),
(202, 7, 'Caseta 3.2', '48', 'Sector en descanso', 0, 0),
(203, 8, 'A-4', '04', 'Rebeca', 0.41, 1),
(204, 8, 'A-5', '05', 'Rebeca', 0.48, 1),
(205, 8, 'A-6', '06', 'Rebeca', 0.44, 1),
(206, 8, 'A-7', '07', 'Laurita', 0.7, 1),
(207, 8, 'A-8', '08', 'Rebeca', 0.6, 1),
(208, 8, 'A-9', '09', 'Rebeca', 0.56, 1),
(209, 8, 'A-10', '10', 'Rebeca', 0.49, 1),
(210, 8, 'A-11', '11', 'Rebeca', 0.54, 1),
(211, 8, 'A-12', '12', 'Rebeca', 0.49, 1),
(212, 8, 'A-13', '13', 'Laurita', 0.76, 1),
(213, 8, 'A-14', '14', 'Elvira', 0.29, 1),
(214, 8, 'A-15', '15', 'Elvira', 0.83, 1),
(215, 8, 'A-16', '16', 'Rebeca', 0.48, 1),
(216, 8, 'A-17', '17', 'Rebeca', 0.94, 1),
(217, 8, 'A-18', '18', 'Rebeca', 0.08, 1),
(218, 8, 'A-19', '19', 'Elvira', 0.37, 1),
(219, 8, 'A-20', '20', 'Elvira', 0.56, 1),
(220, 8, 'A-21', '21', 'Elvira', 0.56, 1),
(221, 8, 'A-22', '22', 'Rebeca', 0.5, 1),
(222, 8, 'A-23', '23', 'Rebeca', 0.54, 1),
(223, 8, 'A-24', '24', 'Rebeca', 0.49, 1),
(224, 8, 'A-25', '25', 'Elvira', 0.5, 1),
(225, 8, 'A-26', '26', 'Elvira', 0.55, 1),
(226, 8, 'A-27', '27', 'Elvira', 0.49, 1),
(227, 8, 'A-28', '28', 'Rebeca', 0.48, 1),
(228, 8, 'A-29', '29', 'Rebeca', 0.53, 1),
(229, 8, 'A-30', '30', 'Rebeca', 0.44, 1),
(230, 8, 'A-31', '31', 'Normita', 0.2, 1),
(231, 8, 'A-32', '32', 'Elvira', 0.45, 1),
(232, 8, 'A-33', '33', 'Elvira', 0.83, 1),
(233, 8, 'A-34', '34', 'Rebeca', 0.58, 1),
(234, 8, 'A-35', '35', 'Rebeca', 0.6, 1),
(235, 8, 'A-36', '36', 'Rebeca', 0.43, 1),
(236, 8, 'A-37', '37', 'Rebeca', 0.34, 1),
(237, 9, 'A-1', '01', 'Elvira', 0.86, 1),
(238, 10, 'A-2', '02', 'Elvira', 1.09, 1),
(239, 10, 'A-3', '03', 'Elvira', 1.14, 1),
(240, 10, 'A-4', '04', 'Elvira', 0.81, 1),
(241, 10, 'A-5', '05', 'Sector en descanso', 0, 0),
(242, 10, 'A-6', '06', 'Sector en descanso', 0, 0),
(243, 10, 'A-7', '07', 'Sector en descanso', 0, 0),
(244, 10, 'A-8', '08', 'Sector en descanso', 0, 0),
(245, 10, 'A-9', '09', 'Sector en descanso', 0, 0),
(246, 10, 'A-10', '10', 'Sector en descanso', 0, 0),
(247, 10, 'A-11', '11', 'Sector en descanso', 0, 0),
(248, 10, 'A-12', '12', 'Sector en descanso', 0, 0),
(249, 10, 'A-13', '13', 'Sector en descanso', 0, 0),
(250, 10, 'A-14', '14', 'Sector en descanso', 0, 0),
(251, 10, 'A-15', '15', 'Rebeca', 1.1, 1),
(252, 10, 'A-16', '16', 'Sector en descanso', 0, 0),
(253, 10, 'A-17', '17', 'Elvira', 1.62, 1),
(254, 10, 'A-18', '18', 'Rebeca', 1.41, 1),
(255, 10, 'A-19', '19', 'Elvira', 0.43, 1),
(256, 11, 'B-1', '01', 'Rebeca', 1.02, 1),
(257, 11, 'B-2', '02', 'Rebeca', 1.18, 1),
(258, 11, 'B-3', '03', 'Rebeca', 0.99, 1),
(259, 11, 'B-4', '04', 'Rebeca', 0.95, 1),
(260, 11, 'B-5', '05', 'Rebeca', 0.77, 1),
(261, 11, 'B-6', '06', 'Sector en descanso', 0, 0),
(262, 11, 'B-7', '07', 'Sector en descanso', 0, 0),
(263, 11, 'B-8', '08', 'Sector en descanso', 0, 0),
(264, 11, 'B-9', '09', 'Sector en descanso', 0, 0),
(265, 11, 'B-10', '10', 'Sector en descanso', 0, 0),
(266, 11, 'B-11', '11', 'Sector en descanso', 0, 0),
(267, 11, 'B-12', '12', 'Sector en descanso', 0, 0),
(268, 11, 'B-13', '13', 'Sector en descanso', 0, 0),
(269, 11, 'B-14', '14', 'Sector en descanso', 0, 0),
(270, 11, 'B-15', '15', 'Sector en descanso', 0, 0),
(271, 11, 'B-16', '16', 'Sector en descanso', 0, 0),
(272, 11, 'B-17', '17', 'Sector en descanso', 0, 0),
(273, 11, 'B-18', '18', 'Rebeca', 1.93, 1),
(274, 11, 'B-19', '19', 'Rebeca', 0.95, 1),
(275, 11, 'B-20', '20', 'Rebeca', 0.47, 1),
(276, 11, 'B-21', '21', 'Sector en descanso', 0, 0),
(277, 11, 'B-22', '22', 'Sector en descanso', 0, 0),
(278, 11, 'B-23', '23', 'Sector en descanso', 0, 0),
(279, 11, 'B-24', '24', 'Sector en descanso', 0, 0),
(280, 11, 'B-25', '25', 'Sector en descanso', 0, 0),
(281, 11, 'B-26', '26', 'Sector en descanso', 0, 0),
(282, 11, 'B-27', '27', 'Sector en descanso', 0, 0),
(283, 11, 'B-28', '28', 'Sector en descanso', 0, 0),
(284, 11, 'B-29', '29', 'Sector en descanso', 0, 0),
(285, 11, 'B-30', '30', 'Sector en descanso', 0, 0),
(286, 11, 'B-31', '31', 'Sector en descanso', 0, 0),
(287, 12, 'C-1', '01', 'Sector en descanso', 0, 0),
(288, 12, 'C-2', '02', 'Sector en descanso', 0, 0),
(289, 12, 'C-3', '03', 'Sector en descanso', 0, 0),
(290, 12, 'C-4', '04', 'Sector en descanso', 0, 0),
(291, 12, 'C-5', '05', 'Sector en descanso', 0, 0),
(292, 12, 'C-6', '06', 'Sector en descanso', 0, 0),
(293, 12, 'C-7', '07', 'Sector en descanso', 0, 0),
(294, 12, 'C-8', '08', 'Sector en descanso', 0, 0),
(295, 12, 'C-9', '09', 'Sector en descanso', 0, 0),
(296, 12, 'C-10', '10', 'Sector en descanso', 0, 0),
(297, 12, 'C-11', '11', 'Rebecas', 0.18, 1),
(298, 12, 'C-12', '12', 'Rebecas', 0.87, 1),
(299, 12, 'C-13', '13', 'Elvira', 1.16, 1),
(300, 12, 'C-14', '14', 'Elvira', 1.89, 1),
(301, 12, 'C-15', '15', 'Rebecas', 0.9, 1),
(302, 12, 'C-16', '16', 'Sector en descanso', 0, 0),
(303, 13, 'A-1', '01', 'Laurita', 0.58, 1),
(304, 13, 'A-2', '02', 'Laurita', 0.51, 1),
(305, 13, 'A-3', '03', 'Laurita', 0.46, 1),
(306, 13, 'A-4', '04', 'Rebeca', 0.51, 1),
(307, 13, 'A-5', '05', 'Rebeca', 0.6, 1),
(308, 13, 'A-6', '06', 'Paulina', 0.54, 1),
(309, 13, 'A-7', '07', 'Paulina', 0.61, 1),
(310, 13, 'A-8', '08', 'Paulina', 0.59, 1),
(311, 13, 'A-9', '09', 'Laurita', 0.56, 1),
(312, 13, 'A-10', '10', 'Elvira', 0.81, 1),
(313, 13, 'A-11', '11', 'BT304.3', 0.36, 1),
(314, 13, 'A-12', '12', 'Elvira', 0.27, 1),
(315, 13, 'A-13', '13', 'Elvira', 0.6, 1),
(316, 13, 'A-14', '14', 'Elvira', 0.57, 1),
(317, 13, 'A-15', '15', 'Elvira', 0.62, 1),
(318, 13, 'A-16', '16', 'Elvira', 0.59, 1),
(319, 13, 'A-17', '17', 'Elvira', 0.42, 1),
(320, 13, 'A-18', '18', 'Elvira', 0.67, 1),
(321, 13, 'A-19', '19', 'Elvira', 0.36, 1),
(322, 13, 'A-20', '20', 'Elvira', 0.59, 1),
(323, 13, 'A-21', '21', 'Elvira', 0.51, 1),
(324, 13, 'A-22', '22', 'Elvira', 0.57, 1),
(325, 13, 'A-23', '23', 'Elvira', 0.78, 1),
(326, 13, 'A-24', '24', 'Elvira', 0.14, 1),
(327, 13, 'A-25', '25', 'Rebeca', 0.5, 1),
(328, 13, 'A-26', '26', 'Rebeca', 0.34, 1),
(329, 13, 'A-27', '27', 'Rebeca', 0.61, 1),
(330, 13, 'A-28', '28', 'Rebeca', 0.59, 1),
(331, 13, 'A-29', '29', 'Rebeca', 0.61, 1),
(332, 13, 'A-30', '30', 'Rebeca', 0.55, 1),
(333, 13, 'A-31', '31', 'Rebeca', 0.86, 1),
(334, 13, 'A-32', '32', 'Rebeca', 0.57, 1),
(335, 13, 'A-33', '33', 'Rebeca', 0.58, 1),
(336, 13, 'A-34', '34', 'Rebeca', 0.6, 1),
(337, 13, 'A-35', '35', 'Rebeca', 0.59, 1),
(338, 13, 'A-36', '36', 'Rebeca', 0.24, 1),
(339, 13, 'A-37', '37', 'Rebeca', 0.87, 1),
(340, 13, 'A-38', '38', 'Rebeca', 0.57, 1),
(341, 13, 'A-39', '39', 'Sector en descanso', 0, 0),
(342, 13, 'A-40', '40', 'Sector en descanso', 0, 0),
(343, 13, 'A-41', '41', 'Sector en descanso', 0, 0),
(344, 13, 'A-42', '42', 'Rebeca', 0.72, 1),
(345, 13, 'A-43', '43', 'Elvira', 0.48, 1),
(346, 13, 'A-44', '44', 'Elvira', 0.75, 1),
(347, 13, 'A-45', '45', 'Elvira', 0.17, 1),
(348, 13, 'A-46', '46', 'Sector en descanso', 0, 0),
(349, 13, 'A-47', '47', 'Sector en descanso', 0, 0),
(350, 13, 'A-48', '48', 'Sector en descanso', 0, 0),
(351, 13, 'A-49', '49', 'Rebeca', 0.2, 1),
(352, 13, 'A-50', '50', 'Sector en descanso', 0, 0),
(353, 13, 'A-51', '51', 'Sector en descanso', 0, 0),
(354, 13, 'A-52', '52', 'Sector en descanso', 0, 0),
(355, 13, 'A-53', '53', 'Sector en descanso', 0, 0),
(356, 13, 'A-54', '54', 'Normita', 0.55, 1),
(357, 13, 'A-55', '55', 'Sector en descanso', 0, 0),
(358, 13, 'A-56', '56', 'Sector en descanso', 0, 0),
(359, 13, 'A-57', '57', 'Sector en descanso', 0, 0),
(360, 13, 'A-58', '58', 'Sector en descanso', 0, 0),
(361, 13, 'A-59', '59', 'Sector en descanso', 0, 0),
(362, 13, 'A-60', '60', 'Sector en descanso', 0, 0),
(363, 13, 'A-61', '61', 'Sector en descanso', 0, 0),
(364, 13, 'A-62', '62', 'Sector en descanso', 0, 0),
(365, 13, 'A-63', '63', 'Sector en descanso', 0, 0),
(366, 13, 'A-64', '64', 'Sector en descanso', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tanques`
--

CREATE TABLE `tanques` (
  `id` int(11) NOT NULL,
  `id_rancho` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `etapa` varchar(50) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `tanques`
--

INSERT INTO `tanques` (`id`, `id_rancho`, `codigo`, `etapa`, `capacidad`, `unidad`, `status`) VALUES
(1, 1, 'TQ-ODA-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(2, 1, 'TQ-ODA-2-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(3, 1, 'TQ-ODA-3-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(4, 1, 'TQ-ODA-4-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(5, 1, 'TQ-ODA-5-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(6, 1, 'TQ-ODA-6-5000', 'Germinación y primeras etapas', 5000, 'L', 1),
(7, 1, 'TQ-ODA-7-5000', 'Pre-floración y floración', 5000, 'L', 1),
(8, 1, 'TQ-ODA-8-5000', 'Crecimiento vegetativo', 5000, 'L', 1),
(9, 2, 'TQ-ZAPOTE-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(10, 2, 'TQ-ZAPOTE-2-2500', 'Pre-floración y floración', 2500, 'L', 1),
(11, 2, 'TQ-ZAPOTE-3-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(12, 2, 'TQ-ZAPOTE-4-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(13, 2, 'TQ-ZAPOTE-5-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(14, 2, 'TQ-ZAPOTE-6-5000', 'Pre-floración y floración', 5000, 'L', 1),
(15, 2, 'TQ-ZAPOTE-7-5000', 'Crecimiento vegetativo', 5000, 'L', 1),
(16, 3, 'TQ-LOMA-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(17, 3, 'TQ-LOMA-2-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(18, 3, 'TQ-LOMA-3-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(19, 3, 'TQ-LOMA-4-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(20, 3, 'TQ-LOMA-5-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(21, 3, 'TQ-LOMA-6-2500', 'Pre-floración y floración', 2500, 'L', 1),
(22, 4, 'TQ-ARIO-PG-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(23, 4, 'TQ-ARIO-PG-2-2500', 'Pre-floración y floración', 2500, 'L', 1),
(24, 4, 'TQ-ARIO-PG-3-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(25, 4, 'TQ-ARIO-PG-4-2500', 'Pre-floración y floración', 2500, 'L', 1),
(26, 4, 'TQ-ARIO-PG-5-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(27, 4, 'TQ-ARIO-PV-1-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(28, 4, 'TQ-ARIO-PV-2-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(29, 4, 'TQ-ARIO-PV-3-2500', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(30, 4, 'TQ-ARIO-PV-4-2500', 'Pre-floración y floración', 2500, 'L', 1),
(31, 5, 'TQ-GUZMAN-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(32, 5, 'TQ-GUZMAN-2-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(33, 5, 'TQ-GUZMAN-3-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(34, 5, 'TQ-GUZMAN-4-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(35, 5, 'TQ-GUZMAN-5-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(36, 5, 'TQ-GUZMAN-6-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(37, 6, 'TQ-SANTIAGUILLO-1-25', 'Germinación y primeras etapas', 2500, 'L', 1),
(38, 6, 'TQ-SANTIAGUILLO-2-25', 'Desarrollo de frutos y maduración', 2500, 'L', 1),
(39, 6, 'TQ-SANTIAGUILLO-3-25', 'Pre-floración y floración', 2500, 'L', 1),
(40, 6, 'TQ-SANTIAGUILLO-4-25', 'Germinación y primeras etapas', 2500, 'L', 1),
(41, 7, 'TQ-CDA-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(42, 7, 'TQ-CDA-2-2500', 'Crecimiento vegetativo', 2500, 'L', 1),
(43, 8, 'TQ-PARAISO-1-2500', 'Germinación y primeras etapas', 2500, 'L', 1),
(44, 8, 'TQ-PARAISO-2-2500', 'Crecimiento vegetativo', 2500, 'L', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tanques_preparados`
--

CREATE TABLE `tanques_preparados` (
  `id` int(11) NOT NULL,
  `codigo_tanque_preparado` varchar(30) NOT NULL,
  `id_tanque` int(11) NOT NULL,
  `id_rancho` int(11) NOT NULL,
  `fecha_preparacion` date NOT NULL,
  `litros_totales` decimal(10,2) NOT NULL,
  `litros_disponibles` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `tanques_preparados`
--

INSERT INTO `tanques_preparados` (`id`, `codigo_tanque_preparado`, `id_tanque`, `id_rancho`, `fecha_preparacion`, `litros_totales`, `litros_disponibles`) VALUES
(7, 'TANQUE-Casas_de_altos-2026', 41, 7, '2026-04-13', 2400.00, 1000.00),
(8, 'TANQUE-Guzman-2026', 31, 5, '2026-04-13', 2500.00, 1500.00),
(9, 'TANQUE-La_loma-2026', 19, 3, '2026-04-13', 2300.00, 1000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temporada`
--

CREATE TABLE `temporada` (
  `id` int(11) NOT NULL,
  `temporada` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `temporada`
--

INSERT INTO `temporada` (`id`, `temporada`, `status`) VALUES
(1, 'Julio24-Junio25', 1),
(2, 'Julio25-Junio26', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `empresa` varchar(50) NOT NULL,
  `ranchos` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `email`, `nombre`, `password`, `rol`, `empresa`, `ranchos`) VALUES
(54, 'ezaragoza', 'Zaragoza051@lgfrutas.com.mx', 'Eduardo Daniel Zaragoza Alvarez', '$2a$10$ZPOh/Fr6i2nF9XiChV5fl.W5NMwOC.ISLY9CvuCrP7dM2imD6j3oW', 'master', 'General', 'General'),
(55, 'DominMa', 'marco.dominguez@lgfrutas.com.mx', 'Marco Antonio Dominguez Tinoco', '$2a$10$ZPOh/Fr6i2nF9XiChV5fl.W5NMwOC.ISLY9CvuCrP7dM2imD6j3oW', 'produccion', 'General', 'General'),
(56, 'esquemi', 'miriam.esqueda@lgfrutas.com.mx', ' Miriam Esqueda Bejar', '$2a$10$ZPOh/Fr6i2nF9XiChV5fl.W5NMwOC.ISLY9CvuCrP7dM2imD6j3oW', 'inocuidad', 'General', 'General');

-- --------------------------------------------------------

--
-- Estructura para la vista `mesclas_preparacion_tamque`
--
DROP TABLE IF EXISTS `mesclas_preparacion_tamque`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mesclas_preparacion_tamque`  AS SELECT `mt`.`id` AS `id`, `tp`.`id` AS `id_tanque_preparado`, `tp`.`litros_totales` AS `litros_totales_tanque`, `tp`.`codigo_tanque_preparado` AS `codigo_tanque_preparado`, `tp`.`fecha_preparacion` AS `fecha_preparacion`, year(`tp`.`fecha_preparacion`) AS `anio`, month(`tp`.`fecha_preparacion`) AS `mes`, `m`.`nombre` AS `mezcla`, `mt`.`cantidad_litros` AS `cantidad_mezcla` FROM ((`mezclas_tanque` `mt` join `tanques_preparados` `tp` on(`tp`.`id` = `mt`.`id_tanque_preparado`)) join `mezclas` `m` on(`m`.`id` = `mt`.`id_mezcla`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `npk_fertilizacion_completo`
--
DROP TABLE IF EXISTS `npk_fertilizacion_completo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `npk_fertilizacion_completo`  AS SELECT `f`.`id` AS `fertilizacion_id`, `f`.`fecha` AS `fecha`, year(`f`.`fecha`) AS `anio`, month(`f`.`fecha`) AS `mes`, `f`.`temporada` AS `temporada`, `s`.`id` AS `id_sector`, `s`.`sector_interno` AS `sector_interno`, `s`.`variedad` AS `variedad`, `s`.`hectareas` AS `hectareas`, `em`.`id` AS `id_empresa`, `em`.`razon_social` AS `razon_social`, `r`.`id` AS `id_rancho`, `r`.`rancho` AS `rancho`, `rd`.`id` AS `id_rancho_dsa`, `rd`.`nombre_rancho_dsa` AS `nombre_rancho_dsa`, `tp`.`codigo_tanque_preparado` AS `codigo_tanque_preparado`, `dft`.`litros_aplicados` AS `litros_aplicados`, sum(case when `a`.`codigo` = 'N' then round(`fa`.`cantidad_aplicada`,2) else 0 end) AS `N_kg`, sum(case when `a`.`codigo` = 'P2O5' then round(`fa`.`cantidad_aplicada`,2) else 0 end) AS `P_kg`, sum(case when `a`.`codigo` = 'K2O' then round(`fa`.`cantidad_aplicada`,2) else 0 end) AS `K_kg`, sum(case when `a`.`codigo` = 'N' then round(`fa`.`cantidad_aplicada` / nullif(`s`.`hectareas`,0),2) else 0 end) AS `N_kg_ha`, sum(case when `a`.`codigo` = 'P2O5' then round(`fa`.`cantidad_aplicada` / nullif(`s`.`hectareas`,0),2) else 0 end) AS `P_kg_ha`, sum(case when `a`.`codigo` = 'K2O' then round(`fa`.`cantidad_aplicada` / nullif(`s`.`hectareas`,0),2) else 0 end) AS `K_kg_ha` FROM ((((((((`fertilizaciones` `f` join `sectores` `s` on(`f`.`id_sector` = `s`.`id`)) join `rancho_dsa` `rd` on(`s`.`id_rancho_dsa` = `rd`.`id`)) join `ranchos` `r` on(`rd`.`id_rancho` = `r`.`id`)) join `empresas` `em` on(`r`.`id_empresa` = `em`.`id`)) join `detalle_fertilizacion_tanques` `dft` on(`f`.`id` = `dft`.`id_fertilizacion`)) join `tanques_preparados` `tp` on(`dft`.`id_tanque_preparado` = `tp`.`id`)) join `fertilizacion_activos` `fa` on(`f`.`id` = `fa`.`id_fertilizacion`)) join `activo_mezcla` `a` on(`fa`.`id_activo` = `a`.`id` and `a`.`es_principal` = 1)) GROUP BY `f`.`id`, `f`.`fecha`, `s`.`sector_interno`, `s`.`variedad`, `s`.`hectareas`, `em`.`id`, `em`.`razon_social`, `r`.`id`, `r`.`rancho`, `rd`.`id`, `rd`.`nombre_rancho_dsa`, `tp`.`codigo_tanque_preparado`, `dft`.`litros_aplicados` ORDER BY `f`.`fecha` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `reporte_mezclas_aplicadas_rancho_mes`
--
DROP TABLE IF EXISTS `reporte_mezclas_aplicadas_rancho_mes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `reporte_mezclas_aplicadas_rancho_mes`  AS SELECT `r`.`id` AS `id`, `r`.`rancho` AS `rancho`, year(`f`.`fecha`) AS `anio`, month(`f`.`fecha`) AS `mes`, `m`.`id` AS `id_mezcla`, `m`.`nombre` AS `mezcla`, count(distinct `f`.`id`) AS `veces_aplicada`, sum(`dft`.`litros_aplicados` * `mt`.`cantidad_litros` / nullif(`tp`.`litros_totales`,0)) AS `total_litros_aplicados` FROM (((((((`ranchos` `r` join `rancho_dsa` `rd` on(`rd`.`id_rancho` = `r`.`id`)) join `sectores` `s` on(`s`.`id_rancho_dsa` = `rd`.`id`)) join `fertilizaciones` `f` on(`f`.`id_sector` = `s`.`id`)) join `detalle_fertilizacion_tanques` `dft` on(`dft`.`id_fertilizacion` = `f`.`id`)) join `tanques_preparados` `tp` on(`tp`.`id` = `dft`.`id_tanque_preparado`)) join `mezclas_tanque` `mt` on(`mt`.`id_tanque_preparado` = `tp`.`id`)) join `mezclas` `m` on(`m`.`id` = `mt`.`id_mezcla`)) GROUP BY `r`.`id`, `r`.`rancho`, year(`f`.`fecha`), month(`f`.`fecha`), `m`.`id`, `m`.`nombre` ORDER BY `r`.`rancho` ASC, year(`f`.`fecha`) ASC, month(`f`.`fecha`) ASC, count(distinct `f`.`id`) DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `resumen_anual_sector_rancho`
--
DROP TABLE IF EXISTS `resumen_anual_sector_rancho`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `resumen_anual_sector_rancho`  AS SELECT `r`.`id` AS `id_rancho`, `r`.`rancho` AS `Rancho`, `s`.`id` AS `id_sector`, `s`.`sector_interno` AS `Sector`, `s`.`sector_agrian` AS `Agrian`, `s`.`variedad` AS `Variedad`, `s`.`hectareas` AS `Hectáreas`, year(`f`.`fecha`) AS `anio`, count(distinct `f`.`id`) AS `Total Fertilizaciones`, round(max(`s`.`hectareas`) * count(distinct `f`.`id`),2) AS `Ha Regadas Totales`, count(distinct case when month(`f`.`fecha`) = 1 then `f`.`id` end) AS `Ene`, count(distinct case when month(`f`.`fecha`) = 2 then `f`.`id` end) AS `Feb`, count(distinct case when month(`f`.`fecha`) = 3 then `f`.`id` end) AS `Mar`, count(distinct case when month(`f`.`fecha`) = 4 then `f`.`id` end) AS `Abr`, count(distinct case when month(`f`.`fecha`) = 5 then `f`.`id` end) AS `May`, count(distinct case when month(`f`.`fecha`) = 6 then `f`.`id` end) AS `Jun`, count(distinct case when month(`f`.`fecha`) = 7 then `f`.`id` end) AS `Jul`, count(distinct case when month(`f`.`fecha`) = 8 then `f`.`id` end) AS `Ago`, count(distinct case when month(`f`.`fecha`) = 9 then `f`.`id` end) AS `Sep`, count(distinct case when month(`f`.`fecha`) = 10 then `f`.`id` end) AS `Oct`, count(distinct case when month(`f`.`fecha`) = 11 then `f`.`id` end) AS `Nov`, count(distinct case when month(`f`.`fecha`) = 12 then `f`.`id` end) AS `Dic`, round(`lt`.`litros_total`,2) AS `Litros Aplicados`, round(`lt`.`litros_total` / nullif(count(distinct `f`.`id`),0),2) AS `Litros Prom/Aplic`, round(`lt`.`litros_total` / nullif(max(`s`.`hectareas`),0),2) AS `Litros/Ha Anual`, round(`npk`.`N_kg`,2) AS `N Total (KG)`, round(`npk`.`P_kg`,2) AS `P Total (KG)`, round(`npk`.`K_kg`,2) AS `K Total (KG)`, round(`npk`.`N_kg` / nullif(max(`s`.`hectareas`),0),2) AS `N KG/Ha Anual`, round(`npk`.`P_kg` / nullif(max(`s`.`hectareas`),0),2) AS `P KG/Ha Anual`, round(`npk`.`K_kg` / nullif(max(`s`.`hectareas`),0),2) AS `K KG/Ha Anual`, round(`npk`.`N_kg` / nullif(count(distinct `f`.`id`),0),2) AS `N KG/Aplic Prom`, round(`npk`.`P_kg` / nullif(count(distinct `f`.`id`),0),2) AS `P KG/Aplic Prom`, round(`npk`.`K_kg` / nullif(count(distinct `f`.`id`),0),2) AS `K KG/Aplic Prom`, round(`npk`.`N_kg` / nullif(max(`s`.`hectareas`) * count(distinct `f`.`id`),0),2) AS `N Dosis/Ha/Aplic`, round(`npk`.`P_kg` / nullif(max(`s`.`hectareas`) * count(distinct `f`.`id`),0),2) AS `P Dosis/Ha/Aplic`, round(`npk`.`K_kg` / nullif(max(`s`.`hectareas`) * count(distinct `f`.`id`),0),2) AS `K Dosis/Ha/Aplic` FROM (((((`fertilizaciones` `f` join `sectores` `s` on(`s`.`id` = `f`.`id_sector`)) join `rancho_dsa` `rd` on(`rd`.`id` = `s`.`id_rancho_dsa`)) join `ranchos` `r` on(`r`.`id` = `rd`.`id_rancho`)) join (select `detalle_fertilizacion_tanques`.`id_fertilizacion` AS `id_fertilizacion`,sum(`detalle_fertilizacion_tanques`.`litros_aplicados`) AS `litros_total` from `detalle_fertilizacion_tanques` group by `detalle_fertilizacion_tanques`.`id_fertilizacion`) `lt` on(`lt`.`id_fertilizacion` = `f`.`id`)) left join (select `fa`.`id_fertilizacion` AS `id_fertilizacion`,sum(case when `a`.`codigo` = 'N' then `fa`.`cantidad_aplicada` else 0 end) AS `N_kg`,sum(case when `a`.`codigo` = 'P2O5' then `fa`.`cantidad_aplicada` else 0 end) AS `P_kg`,sum(case when `a`.`codigo` = 'K2O' then `fa`.`cantidad_aplicada` else 0 end) AS `K_kg` from (`fertilizacion_activos` `fa` join `activo_mezcla` `a` on(`a`.`id` = `fa`.`id_activo` and `a`.`es_principal` = 1)) group by `fa`.`id_fertilizacion`) `npk` on(`npk`.`id_fertilizacion` = `f`.`id`)) GROUP BY `r`.`id`, `r`.`rancho`, `s`.`id`, `s`.`sector_interno`, `s`.`sector_agrian`, `s`.`variedad`, `s`.`hectareas`, year(`f`.`fecha`), `lt`.`litros_total`, `npk`.`N_kg`, `npk`.`P_kg`, `npk`.`K_kg` ORDER BY `r`.`rancho` ASC, `s`.`sector_interno` ASC, year(`f`.`fecha`) ASC ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `activo_mezcla`
--
ALTER TABLE `activo_mezcla`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `aplicaciones_tanque`
--
ALTER TABLE `aplicaciones_tanque`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tanque_preparado` (`id_tanque_preparado`,`id_sector`,`id_responsable`),
  ADD KEY `fk_aplicacionesTanque_responsable` (`id_responsable`);

--
-- Indices de la tabla `detalle_fertilizacion_tanques`
--
ALTER TABLE `detalle_fertilizacion_tanques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_fertilizacion` (`id_fertilizacion`,`id_tanque_preparado`),
  ADD KEY `fk_fertilizacionTanque_tanquePreparado` (`id_tanque_preparado`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `fertilizaciones`
--
ALTER TABLE `fertilizaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sector` (`id_sector`,`id_responsable`),
  ADD KEY `fk__fertilizacion-responsable` (`id_responsable`);

--
-- Indices de la tabla `fertilizacion_activos`
--
ALTER TABLE `fertilizacion_activos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_fertilizacion` (`id_fertilizacion`),
  ADD KEY `id_activo` (`id_activo`);

--
-- Indices de la tabla `mezclas`
--
ALTER TABLE `mezclas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mezclas_tanque`
--
ALTER TABLE `mezclas_tanque`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tanque_preparado` (`id_tanque_preparado`,`id_mezcla`),
  ADD KEY `fk__MezclaTanque-Mezclas` (`id_mezcla`);

--
-- Indices de la tabla `mezcla_activos`
--
ALTER TABLE `mezcla_activos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_mezcla` (`id_mezcla`,`id_activo`),
  ADD KEY `activo_fkid_1` (`id_activo`);

--
-- Indices de la tabla `ranchos`
--
ALTER TABLE `ranchos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empresa` (`id_empresa`);

--
-- Indices de la tabla `rancho_dsa`
--
ALTER TABLE `rancho_dsa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_rancho_dsa` (`numero_rancho_dsa`),
  ADD KEY `id_rancho` (`id_rancho`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rol_name` (`rol_name`);

--
-- Indices de la tabla `sectores`
--
ALTER TABLE `sectores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rancho_dsa` (`id_rancho_dsa`);

--
-- Indices de la tabla `tanques`
--
ALTER TABLE `tanques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rancho` (`id_rancho`);

--
-- Indices de la tabla `tanques_preparados`
--
ALTER TABLE `tanques_preparados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_tanque_preparado` (`codigo_tanque_preparado`),
  ADD KEY `id_mezcla` (`id_tanque`,`id_rancho`),
  ADD KEY `fk-tanques_preparados.rancho` (`id_rancho`);

--
-- Indices de la tabla `temporada`
--
ALTER TABLE `temporada`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `activo_mezcla`
--
ALTER TABLE `activo_mezcla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `aplicaciones_tanque`
--
ALTER TABLE `aplicaciones_tanque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_fertilizacion_tanques`
--
ALTER TABLE `detalle_fertilizacion_tanques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `fertilizaciones`
--
ALTER TABLE `fertilizaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `fertilizacion_activos`
--
ALTER TABLE `fertilizacion_activos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `mezclas`
--
ALTER TABLE `mezclas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `mezclas_tanque`
--
ALTER TABLE `mezclas_tanque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `mezcla_activos`
--
ALTER TABLE `mezcla_activos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `ranchos`
--
ALTER TABLE `ranchos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `rancho_dsa`
--
ALTER TABLE `rancho_dsa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sectores`
--
ALTER TABLE `sectores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=367;

--
-- AUTO_INCREMENT de la tabla `tanques`
--
ALTER TABLE `tanques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `tanques_preparados`
--
ALTER TABLE `tanques_preparados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `temporada`
--
ALTER TABLE `temporada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aplicaciones_tanque`
--
ALTER TABLE `aplicaciones_tanque`
  ADD CONSTRAINT `fk_aplicacionesTanque_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_aplicacionesTanque_tanquePreparado` FOREIGN KEY (`id_tanque_preparado`) REFERENCES `tanques_preparados` (`id`);

--
-- Filtros para la tabla `detalle_fertilizacion_tanques`
--
ALTER TABLE `detalle_fertilizacion_tanques`
  ADD CONSTRAINT `fk_fertilizacionTanque_fertilizacion` FOREIGN KEY (`id_fertilizacion`) REFERENCES `fertilizaciones` (`id`),
  ADD CONSTRAINT `fk_fertilizacionTanque_tanquePreparado` FOREIGN KEY (`id_tanque_preparado`) REFERENCES `tanques_preparados` (`id`);

--
-- Filtros para la tabla `fertilizaciones`
--
ALTER TABLE `fertilizaciones`
  ADD CONSTRAINT `fk__fertilizacion-responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `sector_idfk_1` FOREIGN KEY (`id_sector`) REFERENCES `sectores` (`id`);

--
-- Filtros para la tabla `fertilizacion_activos`
--
ALTER TABLE `fertilizacion_activos`
  ADD CONSTRAINT `activo_fkid_2` FOREIGN KEY (`id_activo`) REFERENCES `activo_mezcla` (`id`),
  ADD CONSTRAINT `fertilizacion_activos_ibfk_1` FOREIGN KEY (`id_fertilizacion`) REFERENCES `fertilizaciones` (`id`);

--
-- Filtros para la tabla `mezclas_tanque`
--
ALTER TABLE `mezclas_tanque`
  ADD CONSTRAINT `fk__MezclaTanque-Mezclas` FOREIGN KEY (`id_mezcla`) REFERENCES `mezclas` (`id`),
  ADD CONSTRAINT `fk__MezclaTanque-tanquePreparado` FOREIGN KEY (`id_tanque_preparado`) REFERENCES `tanques_preparados` (`id`);

--
-- Filtros para la tabla `mezcla_activos`
--
ALTER TABLE `mezcla_activos`
  ADD CONSTRAINT `activo_fkid_1` FOREIGN KEY (`id_activo`) REFERENCES `activo_mezcla` (`id`),
  ADD CONSTRAINT `mescla_fkid_1` FOREIGN KEY (`id_mezcla`) REFERENCES `mezclas` (`id`);

--
-- Filtros para la tabla `ranchos`
--
ALTER TABLE `ranchos`
  ADD CONSTRAINT `empresa_fkid_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id`);

--
-- Filtros para la tabla `rancho_dsa`
--
ALTER TABLE `rancho_dsa`
  ADD CONSTRAINT `rancho_dsa_ibfk_1` FOREIGN KEY (`id_rancho`) REFERENCES `ranchos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `sectores`
--
ALTER TABLE `sectores`
  ADD CONSTRAINT `ranchoDsa_fkid_1` FOREIGN KEY (`id_rancho_dsa`) REFERENCES `rancho_dsa` (`id`);

--
-- Filtros para la tabla `tanques`
--
ALTER TABLE `tanques`
  ADD CONSTRAINT `rancho_fkid_1` FOREIGN KEY (`id_rancho`) REFERENCES `ranchos` (`id`);

--
-- Filtros para la tabla `tanques_preparados`
--
ALTER TABLE `tanques_preparados`
  ADD CONSTRAINT `fk-tanques_preparados-tanque` FOREIGN KEY (`id_tanque`) REFERENCES `tanques` (`id`),
  ADD CONSTRAINT `fk-tanques_preparados.rancho` FOREIGN KEY (`id_rancho`) REFERENCES `ranchos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
