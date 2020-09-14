--
-- Base de datos: `challenge_meli`
--

-- Creo la base de datos si es que no existe
CREATE DATABASE IF NOT EXISTS `challenge_meli` CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Selecciono la base
USE challenge_meli;

-- ------------------------------------------------------------------------------------------
--
-- Estructura de tabla para la tabla `dnas`
--
-- Para esta caso de ejemplo se usa un int de ID que deberia bastar para los ejemplos, si fuera necesario, se usaria un unsgined bigint 20
-- Para estas pruebas, deberia tener mejor rendimiento con el int vs el bigint

CREATE TABLE IF NOT EXISTS `dnas` (
        `id` INT NOT NULL,          
        `dimension` INT NOT NULL,          
        `dna` JSON NOT NULL,
        `type` varchar(1) NOT NULL,
        `method` varchar(1) NOT NULL,
        `time` float(20,16) UNSIGNED NOT NULL,
        `mutations` INT NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


--
-- Indices de la tabla `dnas`
--
ALTER TABLE `dnas`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de la tabla `dnas`
--
ALTER TABLE `dnas`
MODIFY `id` INT NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;


