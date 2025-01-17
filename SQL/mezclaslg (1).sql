-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-12-2024 a las 05:04:52
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
-- Base de datos: `mezclaslg`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `agregar_precio_receta_solicitud` (IN `p_id_solicitud` INT, IN `p_id_producto` INT, IN `p_unidad_medida` VARCHAR(50), IN `p_cantidad` DECIMAL(10,2))   BEGIN 
    DECLARE p_precio DECIMAL(10, 2);

    -- Obtener el precio del producto
    SELECT precio INTO p_precio 
    FROM productos 
    WHERE id_producto = p_id_producto;

    -- Verificar si se encontró el precio
    IF p_precio IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no encontrado o sin precio';
    END IF;

    -- Insertar en la tabla
    INSERT INTO solicitud_receta(id_solicitud, id_producto, unidad_medida, cantidad, precio) 
    VALUES (p_id_solicitud, p_id_producto, p_unidad_medida, p_cantidad, p_precio);

    -- Confirmar cambios
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `agregar_producto_a_receta` (IN `p_id_receta` INT, IN `p_id_producto` INT, IN `p_cantidad` INT)   BEGIN
    DECLARE p_precio DECIMAL(10, 2);

    -- Obtener el precio del producto
    SELECT precio INTO p_precio
    FROM productos
    WHERE id_producto = p_id_producto;

    -- Insertar en la tabla recetas_productos
    INSERT INTO recetas_productos (id_receta, id_producto, cantidad, precio)
    VALUES (p_id_receta, p_id_producto, p_cantidad, p_precio);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `calcular_precio_cantidad` (IN `p_id_solicitud` INT, IN `p_id_producto` INT, IN `p_unidad_medida` VARCHAR(50), IN `p_cantidad` DECIMAL(10,2))   BEGIN
    DECLARE v_precio DECIMAL(10, 2);
    DECLARE v_unidad_producto VARCHAR(50);
    DECLARE v_cantidad_presentacion DECIMAL(10, 2);
    DECLARE v_precio_cantidad DECIMAL(10, 2);
    DECLARE v_cantidad_convertida DECIMAL(10, 2);

    -- Convertir unidad de medida a minúsculas para comparación
    SET p_unidad_medida = LOWER(p_unidad_medida);
    
    -- Obtener el precio, unidad de medida y cantidad de presentación del producto
    SELECT precio, unidad_medida, cantidad_presentacion
    INTO v_precio, v_unidad_producto, v_cantidad_presentacion
    FROM productos
    WHERE id_producto = p_id_producto;

    -- Convertir la unidad de producto a minúsculas
    SET v_unidad_producto = LOWER(v_unidad_producto);

    -- Convertir la cantidad solicitada a la unidad de medida del producto
    IF v_unidad_producto = 'kilogramo' THEN
        IF p_unidad_medida IN ('g', 'gramo') THEN
            -- Convertir gramos a kilogramos
            SET v_cantidad_convertida = p_cantidad / 1000;
        ELSEIF p_unidad_medida IN ('kg', 'kilogramo') THEN
            -- La cantidad ya está en kg
            SET v_cantidad_convertida = p_cantidad;
        ELSE
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Unidad de medida no válida para kilogramos';
        END IF;
    ELSEIF v_unidad_producto = 'litro' THEN
        IF p_unidad_medida IN ('ml', 'mililitro') THEN
            -- Convertir mililitros a litros
            SET v_cantidad_convertida = p_cantidad / 1000;
        ELSEIF p_unidad_medida IN ('lt', 'litro') THEN
            -- La cantidad ya está en lt
            SET v_cantidad_convertida = p_cantidad;
        ELSE
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Unidad de medida no válida para litros';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Unidad de producto no reconocida';
    END IF;

    -- Calcular el precio total basado en la cantidad convertida
    SET v_precio_cantidad = v_precio * v_cantidad_convertida;

    -- Insertar los datos en la tabla solicitud_receta
    INSERT INTO solicitud_receta (
        id_solicitud, 
        id_producto, 
        unidad_medida, 
        cantidad, 
        precio, 
        precio_cantidad
    ) VALUES (
        p_id_solicitud, 
        p_id_producto, 
        p_unidad_medida, 
        p_cantidad, 
        v_precio, 
        v_precio_cantidad
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tu_procedimiento` (IN `p_id_solicitud` INT, IN `p_id_producto` INT, IN `p_unidad_medida` VARCHAR(50), IN `p_cantidad` INT)   BEGIN 
    DECLARE p_precio DECIMAL(10, 2);

    -- Obtener el precio del producto
    SELECT precio INTO p_precio 
    FROM productos 
    WHERE id_producto = p_id_producto;

    -- Verificar si se encontró el precio
    IF p_precio IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no encontrado o sin precio';
    END IF;

    -- Insertar en la tabla
    INSERT INTO solicitud_receta(id_solicitud, id_producto, unidad_medida, cantidad, precio) 
    VALUES (p_id_solicitud, p_id_producto, p_unidad_medida, p_cantidad, p_precio);

    -- Confirmar cambios
    COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centrocoste`
--

CREATE TABLE `centrocoste` (
  `id` int(11) NOT NULL,
  `centroCoste` varchar(50) NOT NULL,
  `empresa` varchar(50) NOT NULL,
  `rancho` varchar(20) NOT NULL,
  `cultivo` varchar(20) NOT NULL,
  `variedad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `centrocoste`
--

INSERT INTO `centrocoste` (`id`, `centroCoste`, `empresa`, `rancho`, `cultivo`, `variedad`) VALUES
(4, 'MFIMPRM Presa/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(6, 'BCEMLL La Loma/Zarzamora', '', 'La Loma', 'Zarzamora', 'Paulinas,BT304.3,Lauritas,Rebecas,Elviras,Normitas'),
(7, 'BIOJAH Ahualulco/Zarzamora', '', 'Ahualulco', 'Zarzamora', 'Lauritas,Rebecas,Paulinas'),
(8, 'BCEMZ Zapote/Zarzamora', '', 'Zapote', 'Zarzamora', 'Elviras,Rebecas,Paulinas,Normitas'),
(9, 'MFIMPZ Pelillos/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(10, 'MFIMSG Santiaguillo/Frambueza', '', 'Romero', 'Frambueza', 'Mya,Jazmin'),
(11, 'BIOJATA Atemajac/Arandano', '', 'Atemajac', 'Arandano', 'Arana,Dupree,Corrina'),
(12, 'MFIMSM Santiaguillo/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(14, 'MFIMAS Ario/Fresa', '', 'Potrero', 'Fresa', 'Minerva,Itzel,Veronica,Yuritzi,Marisabel'),
(15, 'MFIMPL Pelillos/Fresa', '', 'Romero', 'Fresa', 'Minerva,Itzel,Veronica,Yuritzi,Marisabel'),
(16, 'MFIMGMI Guzman/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(17, 'MFIMAF Ario/Frambueza', '', 'Potrero', 'Frambueza', 'Mya,Jazmin,Marilyn'),
(18, 'BIOJATF Atemajac/fresa', '', 'Atemajac', 'Fresa', 'Minerva,Dayana'),
(19, 'MFIMPI Paraíso/Zarzamora', '', 'Romero', 'Zarzamora', 'Elviras,Normitas'),
(20, 'MFIMJM Jimenez/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(22, 'MFIMPM Paraíso/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(24, 'MFIMRM Rincón/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(26, 'OSOJSZ La Soledad/Zarzamora', '', 'La soledad', 'Zarzamora', 'Rebecas,Paulinas,Elviras,Normitas'),
(27, 'BCEMOD Ojo de Agua/Arandano', '', 'Ojo de Agua', 'Arandano', 'Aranas,Kirras,Dupree,Corrina'),
(28, 'MFIMCM Chivas/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(29, 'MFIMCA Casas de Altos/Zarzamora', '', 'Casas de Altos', 'Zarzamora', 'Rebecas'),
(30, 'MFIMGZ Guzman/Frambueza', '', 'Romero', 'Frambueza', 'Mya'),
(31, 'MFIMYM Yegüeras/Maíz', '', 'Romero', 'Maiz', 'Maiz'),
(32, 'BCEMOZ Ojo de Agua/Zarzamora', '', 'Ojo de Agua', 'Zarzamora', 'Lauritas,Rebecas,Elviras,Normitas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` double NOT NULL,
  `unidad_medida` varchar(50) NOT NULL COMMENT 'Unidad de medida del producto (ej. kg, litro, unidad)',
  `cantidad_presentacion` decimal(10,2) NOT NULL COMMENT ' Cantidad que corresponde a una presentación (ej. 1kg, 1 litro)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `unidad_medida`, `cantidad_presentacion`) VALUES
(3, 'Fertilizante Orgánico A', 'Fertilizante orgánico para cultivo de hortalizas.', 25.5, 'kilogramo', 1.00),
(4, 'Fertilizante Químico B', 'Fertilizante químico para cultivos de maíz.', 18.75, 'kilogramo', 1.00),
(8, 'Abono de Liberación Lenta', 'Abono de liberación lenta para fertilizar suelo.', 55, 'kilogramo', 5.00),
(9, 'Pesticida C', 'Pesticida para control de plagas en frutales.', 22.4, 'litro', 1.00),
(10, 'Fungicida D', 'Fungicida para prevención de hongos en cultivos de tomate.', 60, 'litro', 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id_receta` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `recetas`
--

INSERT INTO `recetas` (`id_receta`, `nombre`, `descripcion`) VALUES
(1, 'Receta para Cultivo de Hortalizas', 'Receta para el cultivo de hortalizas con fertilizantes orgánicos y control de plagas.'),
(2, 'Receta para Cultivo de Maíz', 'Receta para cultivar maíz utilizando fertilizantes químicos y control de maleza.'),
(3, 'Receta para Cultivo de Tomate', 'Receta específica para el cultivo de tomate con fungicidas y nutrientes adecuados.'),
(4, 'Receta para Trigo', 'Receta para cultivo de trigo utilizando herbicidas y abono de liberación lenta.'),
(5, 'Receta para Frutales', 'Receta para cultivar frutales, con pesticidas y control de hongos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas_productos`
--

CREATE TABLE `recetas_productos` (
  `id_receta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `id_receta` int(11) DEFAULT NULL,
  `folio` varchar(50) NOT NULL,
  `cantidad` varchar(25) NOT NULL,
  `idCentroCoste` int(11) NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `empresa` varchar(25) NOT NULL,
  `fechaSolicitud` varchar(30) NOT NULL,
  `idUsuarioSolicita` int(11) NOT NULL,
  `idUsuarioMezcla` int(11) NOT NULL,
  `imagenEntrega` varchar(250) NOT NULL,
  `metodoAplicacion` varchar(20) NOT NULL,
  `notaMezcla` varchar(150) NOT NULL,
  `presentacion` varchar(20) NOT NULL,
  `ranchoDestino` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `temporada` varchar(20) NOT NULL,
  `variedad` varchar(20) NOT NULL,
  `fechaEntrega` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `id_receta`, `folio`, `cantidad`, `idCentroCoste`, `descripcion`, `empresa`, `fechaSolicitud`, `idUsuarioSolicita`, `idUsuarioMezcla`, `imagenEntrega`, `metodoAplicacion`, `notaMezcla`, `presentacion`, `ranchoDestino`, `status`, `temporada`, `variedad`, `fechaEntrega`) VALUES
(78, NULL, '35124', '1.00', 14, '', 'Moras Finas', '2024-11-25', 1, 1, '../uploads/image_1733176303720.jpg', 'Drench', 'hola', 'Barril', 'Potrero', 'Completada', 'Julio23-Junio24', 'Minerva', '2024-12-02'),
(79, NULL, '721', ' 1 1/2', 9, 'erwer we', 'Moras Finas', '2024-11-25', 1, 1, '../uploads/image_1733169515946.jpg', 'Filtro', 'adasdasdasd', 'Barril', 'Romero', 'Completada', 'Julio24-Junio25', 'Maiz', '2024-12-02'),
(80, NULL, '3213234', ' 1 1/2', 14, 'qqwqw', 'Moras Finas', '2024-11-29', 1, 1, '../uploads/image_1733169293172.jpg', 'Riego', '', 'Willi', 'Potrero', 'Completada', 'Julio23-Junio24', 'Minerva', 'Invalid date'),
(81, NULL, '3213', ' 1 1/2', 14, 'sdadad', 'Moras Finas', '2024-12-01', 1, 1, '../uploads/image_1733168442658.jpg', 'Drench', 'prueba 1', 'Willi', 'Potrero', 'Proceso', 'Julio23-Junio24', 'Minerva', 'Invalid date'),
(82, NULL, '3213', ' 1 1/2', 17, '', 'Moras Finas', '2024-12-04', 3, 0, '', 'Herbicida', '', 'Garrafa', 'Potrero', 'Pendiente', 'Julio23-Junio24', 'Mya', ''),
(83, NULL, '2132121321', ' 1 1/2', 14, 'sad', 'Moras Finas', '2024-12-04', 3, 0, '', 'Filtro', '', 'Willi', 'Potrero', 'Proceso', 'Julio24-Junio25', 'Minerva', ''),
(84, NULL, '3213', ' 1 1/2', 14, 'asas', 'Moras Finas', '2024-12-04', 3, 1, '../uploads/image_1733340892058.jpg', 'Filtro', 'asdasd', 'Willi', 'Potrero', 'Completada', 'Julio23-Junio24', 'Itzel', '2024-12-04'),
(85, NULL, '3213234', '213', 17, 'sdfdfsf', 'Moras Finas', '2024-12-04', 4, 0, '', 'Termonebulizacion', '', 'Barril', 'Potrero', 'Proceso', 'Julio23-Junio24', 'Jazmin', ''),
(86, NULL, '2132121321', ' 1 1/2', 14, 'asa', 'Moras Finas', '2024-12-04', 4, 0, '', 'Termonebulizacion', 'Se cambio el fertilizante C, por el fetilizante D', 'Barril', 'Potrero', 'Proceso', 'Julio24-Junio25', 'Veronica', ''),
(87, NULL, '2132121321', ' 1 1/2', 17, '', 'Moras Finas', '2024-12-04', 4, 1, '../uploads/image_1733343942354.jpg', 'Riego', '', 'Garrafa', 'Potrero', 'Completada', 'Julio23-Junio24', 'Mya', '2024-12-04'),
(88, NULL, '321', ' 1 1/2', 17, '', 'Moras Finas', '2024-12-06', 3, 1, '../uploads/image_1733524294659.png', 'Filtro', '', 'Willi', 'Potrero', 'Completada', 'Julio23-Junio24', 'Jazmin', '2024-12-06'),
(89, NULL, '721', ' 1 1/2', 14, '', 'Moras Finas', '2024-12-12', 3, 0, '', 'Trampeo', '', 'Barril', 'Potrero', 'Proceso', 'Julio23-Junio24', 'Minerva', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_receta`
--

CREATE TABLE `solicitud_receta` (
  `id_receta` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `unidad_medida` varchar(10) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `precio_cantidad` decimal(10,2) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `solicitud_receta`
--

INSERT INTO `solicitud_receta` (`id_receta`, `id_solicitud`, `id_producto`, `unidad_medida`, `cantidad`, `precio`, `precio_cantidad`, `status`) VALUES
(1, 78, 4, 'kilogramo', 120.00, 18.75, 2250.00, 0),
(2, 78, 9, 'litro', 145.00, 22.40, 3248.00, 0),
(3, 78, 3, 'gramo', 148.00, 25.50, 3.83, 0),
(4, 78, 8, 'gramo', 120.00, 55.00, 6.60, 0),
(5, 79, 4, 'kilogramo', 21.00, 18.75, 393.75, 1),
(6, 79, 9, 'litro', 12.00, 22.40, 268.80, 1),
(23, 79, 10, 'litro', 21.00, 60.00, 1260.00, 1),
(24, 79, 8, 'kilogramo', 1.00, 55.00, 55.00, 1),
(25, 79, 3, 'gramo', 12.00, 25.50, 0.26, 1),
(26, 78, 10, 'mililitro', 200.00, 60.00, 12.00, 0),
(27, 80, 3, 'kilogramo', 2.00, 25.50, 51.00, 0),
(28, 80, 9, 'litro', 5.00, 22.40, 112.00, 0),
(29, 80, 8, 'gramo', 100.00, 55.00, 5.50, 0),
(30, 80, 4, 'gramo', 120.00, 18.75, 2.25, 0),
(31, 81, 3, 'kilogramo', 10.00, 25.50, 255.00, 0),
(32, 81, 4, 'gramo', 123.00, 18.75, 2.25, 0),
(33, 81, 10, 'litro', 0.99, 60.00, 59.40, 0),
(34, 82, 3, 'kilogramo', 12.00, 25.50, 306.00, 0),
(35, 82, 4, 'kilogramo', 14.00, 18.75, 262.50, 0),
(36, 82, 8, 'kilogramo', 9.00, 55.00, 495.00, 0),
(37, 82, 9, 'litro', 5.00, 22.40, 112.00, 0),
(38, 82, 10, 'mililitro', 200.00, 60.00, 12.00, 0),
(39, 83, 8, 'kilogramo', 23.00, 55.00, 1265.00, 0),
(40, 83, 3, 'kilogramo', 3.00, 25.50, 76.50, 0),
(41, 83, 9, 'litro', 23.00, 22.40, 515.20, 0),
(42, 84, 3, 'kilogramo', 12.00, 25.50, 306.00, 0),
(43, 85, 3, 'kilogramo', 12.00, 25.50, 306.00, 0),
(44, 85, 4, 'kilogramo', 11.99, 18.75, 224.81, 0),
(45, 86, 3, 'gramo', 12.00, 25.50, 0.26, 0),
(46, 87, 9, 'litro', 12.00, 22.40, 268.80, 0),
(47, 88, 3, 'kilogramo', 11.00, 25.50, 280.50, 0),
(48, 88, 4, 'gramo', 200.00, 18.75, 3.75, 0),
(49, 88, 8, 'kilogramo', 1.00, 55.00, 55.00, 0),
(50, 88, 9, 'litro', 10.00, 22.40, 224.00, 0),
(51, 88, 10, 'mililitro', 100.00, 60.00, 6.00, 0),
(52, 86, 4, 'kilogramo', 12.00, 18.75, 225.00, 0),
(53, 86, 8, 'kilogramo', 120.00, 55.00, 6600.00, 0),
(54, 86, 9, 'litro', 12.00, 22.40, 268.80, 0),
(55, 89, 3, 'kilogramo', 12.00, 25.50, 306.00, 0),
(56, 89, 4, 'gramo', 120.00, 18.75, 2.25, 0),
(57, 89, 9, 'litro', 1.00, 22.40, 22.40, 0),
(58, 86, 10, 'litro', 10.00, 60.00, 600.00, 0);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `total_precio_cantidad_solicitud`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `total_precio_cantidad_solicitud` (
`id_solicitud` int(11)
,`idUsuarioSolicita` int(11)
,`usuario` varchar(50)
,`empresa` varchar(25)
,`rancho` varchar(20)
,`temporada` varchar(20)
,`folio` varchar(50)
,`idCentroCoste` int(11)
,`centroCoste` varchar(50)
,`variedad` varchar(20)
,`fechaSolicitud` varchar(30)
,`fechaEntrega` varchar(30)
,`precio_cantidad` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `rol` varchar(25) NOT NULL,
  `empresa` varchar(50) NOT NULL,
  `ranchos` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `nombre`, `password`, `rol`, `empresa`, `ranchos`) VALUES
(1, 'lg@lg.com', 'juna manuel salomon ramirez', '$2a$10$i/gwTcgMhHedT7xHl0leUuJgvL9Ur7vP2P9KHYhGPPd96Od.e9nR.', 'mezclador', 'Moras Finas', 'Potrero,Romero'),
(2, 'lg3@lg.com', 'anonio roman vaca', '$2a$10$V4QNykyvwcrBpuAsKbIJR.2J9Qox7Zmiy.fD1MCFict480TcK4oyu', 'admin', 'Casa negra', 'General'),
(3, 'lg2@lg.com', 'luis mencho casas', '$2a$10$nR4/2ph2YDYDjb8hM/nz8.b5upDyG0IrobYlddsN52tvSLzH0pVcq', 'solicita', 'Moras Finas', 'Potrero,Romero'),
(4, 'lg4@lg.com', 'manuel mendoza mata', '$2a$10$..6NYuIpJT3v3nZ93xoPCu2tdz8mSPfuvdYgxjaJcN61LzHVBsQ7G', 'solicita', 'Moras Finas', 'Potrero,Romero'),
(5, 'qwe@sad.com', 'maria dolores ', '$2a$10$zYCLGvhaujSP8hauf6S4reQb32HQGAjE6yxp46CpkBq1oE2Yvkbi6', 'admin', 'Moras Finas', 'Carne,Carne,Carne'),
(6, 'abeja@sad.com', 'maria dolores ', '$2a$10$GnFk/J4FhK7WRRC6Y0LmHue1q949gxyYtVzHxXvECDZNYQOOgafli', 'admin', 'Ballas del centro', 'Carne,Carne'),
(7, 'yonob25502@operades.com', 'maria dolores ', '$2a$10$keDWHWSqwlNYYhfKjMxeCu5dMYYdBLY.OzrCm/5FvhASOTr32vCRW', 'admin', 'Moras Finas', 'Carne,Carne,Carne'),
(8, 'as@has.com', 'maria dolores ', '$2a$10$HCT/V4bcMQdNbz4Y6RQ8Kew7elONTjlgGsqaGPXKIl4sExLfZ5pPK', 'admin', 'Moras Finas', 'Carne,Leche');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_solicitudes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_solicitudes` (
`id_solicitud` int(11)
,`idUsuarioSolicita` int(11)
,`usuario` varchar(50)
,`empresa` varchar(25)
,`rancho` varchar(20)
,`temporada` varchar(20)
,`folio` varchar(50)
,`idCentroCoste` int(11)
,`centroCoste` varchar(50)
,`variedad` varchar(20)
,`fechaSolicitud` varchar(30)
,`fechaEntrega` varchar(30)
,`precio_cantidad` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_total_precio_cantidad_usuario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_total_precio_cantidad_usuario` (
`idUsuarioSolicita` int(11)
,`nombre` varchar(50)
,`fechaSolicitud` varchar(30)
,`fechaEntrega` varchar(30)
,`suma_precio_cantidad` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `total_precio_cantidad_solicitud`
--
DROP TABLE IF EXISTS `total_precio_cantidad_solicitud`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `total_precio_cantidad_solicitud`  AS SELECT `s`.`id` AS `id_solicitud`, `s`.`idUsuarioSolicita` AS `idUsuarioSolicita`, `us`.`nombre` AS `usuario`, `s`.`empresa` AS `empresa`, `s`.`ranchoDestino` AS `rancho`, `s`.`temporada` AS `temporada`, `s`.`folio` AS `folio`, `s`.`idCentroCoste` AS `idCentroCoste`, `cc`.`centroCoste` AS `centroCoste`, `s`.`variedad` AS `variedad`, `s`.`fechaSolicitud` AS `fechaSolicitud`, `s`.`fechaEntrega` AS `fechaEntrega`, sum(`sr`.`precio_cantidad`) AS `precio_cantidad` FROM (((`solicitudes` `s` join `solicitud_receta` `sr` on(`s`.`id` = `sr`.`id_solicitud`)) join `usuarios` `us` on(`s`.`idUsuarioSolicita` = `us`.`id`)) join `centrocoste` `cc` on(`s`.`idCentroCoste` = `cc`.`id`)) GROUP BY `sr`.`id_solicitud` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_solicitudes`
--
DROP TABLE IF EXISTS `vista_solicitudes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_solicitudes`  AS SELECT `s`.`id` AS `id_solicitud`, `s`.`idUsuarioSolicita` AS `idUsuarioSolicita`, `us`.`nombre` AS `usuario`, `s`.`empresa` AS `empresa`, `s`.`ranchoDestino` AS `rancho`, `s`.`temporada` AS `temporada`, `s`.`folio` AS `folio`, `s`.`idCentroCoste` AS `idCentroCoste`, `cc`.`centroCoste` AS `centroCoste`, `s`.`variedad` AS `variedad`, `s`.`fechaSolicitud` AS `fechaSolicitud`, `s`.`fechaEntrega` AS `fechaEntrega`, `sr`.`precio_cantidad` AS `precio_cantidad` FROM (((`solicitudes` `s` join `solicitud_receta` `sr` on(`s`.`id` = `sr`.`id_solicitud`)) join `usuarios` `us` on(`s`.`idUsuarioSolicita` = `us`.`id`)) join `centrocoste` `cc` on(`s`.`idCentroCoste` = `cc`.`id`)) GROUP BY `sr`.`id_solicitud` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_total_precio_cantidad_usuario`
--
DROP TABLE IF EXISTS `vista_total_precio_cantidad_usuario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_total_precio_cantidad_usuario`  AS SELECT `s`.`idUsuarioSolicita` AS `idUsuarioSolicita`, `us`.`nombre` AS `nombre`, `s`.`fechaSolicitud` AS `fechaSolicitud`, `s`.`fechaEntrega` AS `fechaEntrega`, sum(`sr`.`precio_cantidad`) AS `suma_precio_cantidad` FROM ((`solicitudes` `s` join `solicitud_receta` `sr` on(`s`.`id` = `sr`.`id_solicitud`)) join `usuarios` `us` on(`s`.`idUsuarioSolicita` = `us`.`id`)) GROUP BY `s`.`idUsuarioSolicita` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `centrocoste`
--
ALTER TABLE `centrocoste`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id_receta`);

--
-- Indices de la tabla `recetas_productos`
--
ALTER TABLE `recetas_productos`
  ADD PRIMARY KEY (`id_receta`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_receta` (`id_receta`);

--
-- Indices de la tabla `solicitud_receta`
--
ALTER TABLE `solicitud_receta`
  ADD PRIMARY KEY (`id_receta`),
  ADD KEY `id_solicitud` (`id_solicitud`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `centrocoste`
--
ALTER TABLE `centrocoste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id_receta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `solicitud_receta`
--
ALTER TABLE `solicitud_receta`
  MODIFY `id_receta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `recetas_productos`
--
ALTER TABLE `recetas_productos`
  ADD CONSTRAINT `recetas_productos_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id_receta`),
  ADD CONSTRAINT `recetas_productos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `id_recetas` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id_receta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitud_receta`
--
ALTER TABLE `solicitud_receta`
  ADD CONSTRAINT `solicitud_receta_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitud_receta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
