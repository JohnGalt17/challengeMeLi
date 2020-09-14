/*
 *	Archivo de entrada a la aplicacion
 *	Desde aca arranca la aplicacion
 */
 
/*
 *	1) Importación de dependencias
 */
const path = require('path');

// Libreria para manejo de archivos
const fs = require('fs');		

// Framework para aplicaciones web y REST API															
const express = require('express');																	

// Creo un objeto app de express.js
const app = express();																							

// Middleware: parsea automaticamente el contenido de los requests
const bodyParser = require('body-parser');		

// Middleware para seguridad de requests
const helmet = require('helmet');	

// Middleware para seguridad CORS																	
const cors = require('cors');	

// Obtengo las variables de configuracion de la aplicacion
const CONFIG_APP = require('./src/consts/configApp.json');

/*
 *	2) Variables y constantes
 */

// Puerto en donde se iniciara la aplicacion
const port = CONFIG_APP.port;	

// Motor de base de datos a utilizar																						
const dbEngine = CONFIG_APP.dbEngine;																				


/*
 *	3) Importacion de rutas e instanciado de middlewares
 *	Desde el archivo de rutas redirijo las peticiones a sus respectivos controladores
 */

// Importo las rutas
const routes = require('./api/routes.js');							

// Instancio los middlewares

// Habilito la aplicacion tambien si esta detras de un proxy
app.enable('trust proxy');		

// Middleware para implementar CORS. Habilito CORS para todos los origenes													
app.use(cors({origin: '*', optionsSuccessStatus: 200}));

// Middleware de seguridad de requests
app.use(helmet());																			

// Middleware para parsear los request
app.use('/', bodyParser.json({limit: '16kb'}));	

// Middleware para parsear los request			
app.use(bodyParser.urlencoded({extended: true})); 		

// Los archivos alojados en la carpeta "public" seran de libre acceso por el navegador	
app.use(express.static('public', {dotfiles:'allow'}));	

// Instancio las rutas a los controllers										
app.use('/', routes);																		


/*
 *	4) Conexion a la base de datos
 *	Segun el motor de base de datos que voy a utilizar, instancio una conexion
 */

const model = require('./src/models/mysql.js');

async function dbTest() {
	try{
		let connection = await model.testConnection();
		if(connection){
			console.log('************* OK ************* ');
		}
	}catch(err){
		console.log('************* ERROR ************* ');
		console.info(err);
	}
}

switch (dbEngine) {
	case 'mysql':
		dbTest();
		break;
	default:
		console.log('No hay una base de datos configurada, configuraste el archivo /src/const/configApp.json correctamente?');
		break;
		
};

/*
 * 5) Iniciar servidor
 */
app.listen(port, () => {
	console.log('Servidor iniciado en puerto ' + port);
});