/*
 *	Este archivo corresponde a la capa de acceso a datos
 */
 
/*
 *	1) Importacion de dependencias
 */

// Base de datos
const mysql = require('../mysql.js');																						

/*
 *	2) Metodos
 */

// Metodo para guardar un dna
const saveDNA = async (dimension, dna, type, method, time, countMutations) => {
	// Armo la query 
	const sql = ` 	INSERT INTO dnas (dimension, dna, type, method, time, mutations ) 
					VALUES ('${dimension}', '${JSON.stringify(dna)}', '${type}', '${method}', '${time}', '${countMutations}' ); `;

	// Ejecuto la consulta 
	const result = await mysql.rawQuery(sql); 

	return result;
}

// Metodo para obtener estadisticas segun el tipo de que se requiere
const getCount = async (type) => {
	// Armo la query 
	const sql = `	SELECT COUNT(*) AS Total
					FROM dnas D
					WHERE D.type = '${type}' `;

	// Ejecuto la consulta 
	const result = await mysql.rawQuery(sql);

	return result[0]['Total'];
}

module.exports = {
	saveDNA,
	getCount
};