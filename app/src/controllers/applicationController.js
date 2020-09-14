/*
 *	Los controladores manejan el filtro inicial del request, y llaman a los servicios donde se encuentra la logica del desafio
 */
 
/*
 *	1) Importacion de dependencias
 */
const path = require('path');						

// Importacion de servicios
const applicationService = require('../services/applicationService.js');


/*
 *	2) Actions del Controller
 */
const helloWorld = (req, res, next) => {
	try {
		// LLamo al servicio para obtener la version de la aplicacion
		const serviceResponse = applicationService.helloWorld();

		if (serviceResponse) {
			console.log('Se obtuvo exitosamente el saludo. Controllers "application" Metodo "helloWorld"');
			res.status(200).json(serviceResponse);		// Codigo HTTP 200: OK
		} else {
			console.log('Ha ocurrido un error al intentar saludar! Controller: "application". Metodo: "helloWorld"');
			res.status(403).json('Forbidden');			// Codigo HTTP 403: Error en el servidor
		}
		next();
	} catch (err) {
		console.error('Ha ocurrido un error al intentar saludar! Controller: "application". Metodo: "helloWorld"', err);
    	res.status(403).json('Forbidden') && next(err);	// Codigo HTTP 403: Error en el servidor
  }
}

// Metodo para el mutantM1
const mutantM1 = async (req, res, next) => {
	try {
		// LLamo al servicio correspondiente 
		const serviceResponse = await applicationService.mutantM1(req.body);

		if (serviceResponse && serviceResponse.status == 'OK') {
			console.log('Se obtuvo exitosamente el DNA. Controllers "application" Metodo "mutantM1"');
			res.status(200).json(serviceResponse);		// Codigo HTTP 200: OK
		} else {
			console.log('Ha ocurrido un error al intentar detectar un DNA! Controller: "application". Metodo: "mutantM1"');
			res.status(403).json('Forbidden');			// Codigo HTTP 403: Error en el servidor
		}
		next();
	} catch (err) {
		console.error('Ha ocurrido un error al intentar detectar un DNA! Controller: "application". Metodo: "mutantM1"', err);
    	res.status(403).json('Forbidden') && next(err);	// Codigo HTTP 403: Error en el servidor
  }
}

// Metodo para el mutantM2
const mutantM2 = async (req, res, next) => {
	try {
		// LLamo al servicio correspondiente 
		const serviceResponse = await applicationService.mutantM2(req.body);

		if (serviceResponse && serviceResponse.status == 'OK') {
			console.log('Se obtuvo exitosamente el DNA. Controllers "application" Metodo "mutantM2"');
			res.status(200).json(serviceResponse);		// Codigo HTTP 200: OK
		} else {
			console.log('Ha ocurrido un error al intentar detectar un DNA! Controller: "application". Metodo: "mutantM2"');
			res.status(403).json('Forbidden');			// Codigo HTTP 403: Error en el servidor
		}
		next();
	} catch (err) {
		console.error('Ha ocurrido un error al intentar detectar un DNA! Controller: "application". Metodo: "mutantM2"', err);
    	res.status(403).json('Forbidden') && next(err);	// Codigo HTTP 403: Error en el servidor
  }
}

// Metodo para el stats
const stats = async (req, res, next) => {
	try {
		// LLamo al servicio correspondiente 
		const serviceResponse = await applicationService.stats();

		if (serviceResponse) {
			console.log('Se obtuvieron exitosamente las estadisticas. Controllers "application" Metodo "stats"');
			res.status(200).json(serviceResponse);		// Codigo HTTP 200: OK
		} else {
			console.log('Ha ocurrido un error al intentar obtener las estadisticas! Controller: "application". Metodo: "stats"');
			res.status(403).json('Forbidden');			// Codigo HTTP 403: Error en el servidor
		}
		next();
	} catch (err) {
		console.error('Ha ocurrido un error al intentar obtener las estadisticas! Controller: "application". Metodo: "stats"', err);
    	res.status(403).json('Forbidden') && next(err);	// Codigo HTTP 403: Error en el servidor
  }
}

// Metodo para el index
const index = (req, res, next) => {
	res.sendFile(path.join(__dirname, '../../public', 'index.html'));
}

module.exports = {
	helloWorld,
	mutantM1,
	mutantM2,
	stats,
	index
};