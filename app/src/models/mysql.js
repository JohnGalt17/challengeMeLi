/*
 *	Implementacion propia del driver de conexion de Mysql
 */
 
/*
 *	1) Importacion de dependencias
 */

// Libreria de conexion a mysql
const mysql = require('mysql');															

// Obtengo las variables de configuracion de la base de datos
const CONFIG_DB = require('../../src/consts/configDb.json');

// Creo conexion en pool
const pool = mysql.createPool({
	host	 : 	CONFIG_DB.host,
  	port	 :	CONFIG_DB.port,
  	user     : 	CONFIG_DB.user,
  	password : 	CONFIG_DB.password,
  	database : 	CONFIG_DB.database
});


/*
 *	2) Funciones
 */

// Funcion para probar la conexion a la base de datos 
async function testConnection() {
	return new Promise( (resolve, reject) => {
		
		try {
			pool.getConnection( (err, conn) => {
				if(err){
					console.log('Error en la conexion con la base de datos, configuraste el archivo de configDb.json con las credenciales?');
					console.info(err);
					reject(err);
				}
				
				if(conn){
					console.log('Conexion exitosa a la base de datos!');
					conn.release();
					resolve(true);
				}
				
				
			});
		}catch(err){
			reject(err);
		}
		
	});
}

// Funcion para ejecutar queries. Recibe SQL puro
function rawQuery(sql) {
	return new Promise( (resolve, reject) => {
		pool.getConnection( (err, conn) => {
			if (err) {
				// Error al obtener el pool de conexion
				reject(err);
			}
			
			// Intento ejecutar query
			conn.query(sql, (err, result) => {
				// Si se llego aca, la query fue ejecutada (ya sea con o sin exito)
				// Devuelvo la conexion al pool de conexiones
				conn.release();
				if (err) {
					reject(err);
				} else {
					// La query se ejecuto exitosamente. Devuelvo resultados
					resolve(result);
				}
			});
		});
	});
}


module.exports = {
	testConnection,
	rawQuery
};