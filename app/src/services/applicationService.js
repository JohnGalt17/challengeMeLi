/*
 *	Los servicios manejan la logica principal, sin el acceso a la base de datos.
 *	Se hacen las validaciones de datos y el acceso a los datos, ya sea para consultar, alta, modificacion o baja, o llamadas a otros servicios y/o datos
 */

/*
 *	1) Importacion de dependencias y configuraciones 
 */

// Libreria de validaciones
const joi = require('joi');	

// Implementacion propia de Joi																					
const joiWrapper = require('../middlewares/joiWrapper.js');

// Obtengo las variables de configuracion de la aplicacion
const CONFIG_APP = require('../../src/consts/configApp.json');

// Motor de base de datos a utilizar																						
const dbEngine = CONFIG_APP.dbEngine;														

// Importo la capa de Acceso a Datos segun el motor de base de datos que estoy utilizando
const applicationModel = require('../models/' + dbEngine + '/applicationModel.js');

// Importo la liberia para la perfomance de la aplicacion (en milisegundos)
const { performance } = require('perf_hooks');

// Cantida de maxima de mutaciones que puede tener un humano, en caso de tener mas, ya es mutante
const MAX_MUTATIONS = 3;

// Mensaje de mutacion 
const mutation = {
	status: 'OK',
	type: 	'MUTANTE_2',
	msg:	'Es mutante porque tiene al menos 3 mutaciones'
};

// Mensaje de humano 
const human = {
	status: 'OK',
	type: 	'HUMANO',
	msg:	'Es un humano porque tiene menos de 3 mutaciones'
};

/*
 *	2) Metodos de servicios
 */

//	Servicio de prueba
const helloWorld = () => {
	return {
		status: 'OK',
		msg: 'hola mundo!'
	};
}

// Servicio 1 para saber si un dna es humano o mutante
const mutantM1 = async (data) => {
	/*
	 *	Validacion de datos
	 *	Esta parte podria mejorarse mas, pero no hace a la esencia del enunciado
	 */

	// Defino la estrategia de validacion de los datos
	const validationSchema = {
		dna: joi.required(),								
	};

	// Valido los datos del request
	let validatedData = await joiWrapper.validateData(data, validationSchema);

	validatedData = JSON.parse(JSON.stringify(validatedData));

	if (validatedData.hasOwnProperty('status')) {
		// Error de validacion
		return validatedData;
	}

	try{
		
		
		// Es un elemento que contiene una cantidad de arrays segun la dimension N de una matriz de NxN.
		// Cada elemento tiene N caracteres que pueden ser A, T, C o G
		let dna = data.dna; 

		// Obtengo el N
		let n = dna.length;

		// Si el N es menor a 4, ya se que es mutante 
		if( n < 4 ){
			let result = await guardarMutante(dna, n, time, 'M', '2', 0);
			return {
				status: 'OK',
				type: 	'MUTANTE_1',
				msg:	'Es mutante porque su dimension es menor a 4'
			};
		}

		

		// Como la matriz es de NxN
		//	ATGCGA
		//	CAGTGC
		//	TTATGT
		//	AGAAGG
		//	CCCCTA
		//	TCACTG

		// Inicio la cantidad de mutaciones
		let countMutations = 0;

		// Inicio el maximo interesante a buscar para las diagonales
		let maxBus = n - 3;


		// Metodo 1
		
		// Tomo el tiempo donde inicia el metodo
		const time = performance.now();

		//	Recorro las filas y cuento la cantidad de mutaciones "legitimas"
		//	Recorro la columnas y cuento la cantidad de mutaciones "legitimas"
		//	Recorro diagonales y cuento la cantida de mutaciones "legitimas"

		// Comparo por  filas del objeto
		for(let i=0; i < n ; i++){
			for(let j=0; j < n; j++){
				// Tengo una mutacion horizontal, siempre que sea mi posicion y las proximas 3 sean iguales
				// Y la anterior (salvo para la posicion inicial, no sea la misma)

				// Reviso si puede ser mutante horizontal	
				if( j < maxBus){ 	
					if( ( dna[i][j] == dna[i][j+1] && dna[i][j] == dna[i][j+2] &&  dna[i][j] == dna[i][j+3] && j == 0 ) ||
						( dna[i][j] == dna[i][j+1] &&  dna[i][j] == dna[i][j+2] && dna[i][j] == dna[i][j+3] && dna[i][j] != dna[i][j-1] ) ){

						// Sumo la mutacion 
						countMutations++; 
						
						// Devuelvo que es mutante
						if( countMutations >= MAX_MUTATIONS ){
							let result = await guardarMutante(dna, n, time, 'M', '1', countMutations);
							return mutation;
						}
						
					}
				}
			}
		}

		// Comparo por columnas el objeto
		for(let i=0; i < n ; i++){
			for(let j=0; j < n; j++){
				// Tengo una mutacion vertical, siempre que sea mi posicion y las proximas 3 sean iguales
				// Y la anterior (salvo para la posicion inicial, no sea la misma)

				// Reviso si puede ser mutante vertical	
				if( i < maxBus){ 
					// Reviso las 2 opciones por las cuales puede ser mutante 
					if(	( dna[i][j] == dna[i+1][j] && dna[i][j] == dna[i+2][j] && dna[i][j] == dna[i+3][j] && i == 0 ) ||
						( dna[i][j] == dna[i+1][j] && dna[i][j] == dna[i+2][j] && dna[i][j] == dna[i+3][j] && dna[i][j] != dna[i-1][j] ) ){
							// Sumo la mutacion 
							countMutations++; 
						
							// Devuelvo que es mutante
							if( countMutations >= MAX_MUTATIONS ){
								let result = await guardarMutante(dna, n, time, 'M', '1', countMutations);
								return mutation;
							}
					}
				}
			}
		}

		// Comparo por diagonales
		// Para la comparacion de diagonales segun grafico excel 1 
		for(let i=0; i < (n-3) ; i++){
			// Estoy con la primer 1 FILA 
			for(let j=0; j < (n-3) ; j++){
				// Tengo una mutacion vertical, siempre que sea mi posicion y las proximas 3 sean iguales
				// Y la anterior (salvo para la posicion inicial, no sea la misma)

				if(	( dna[i][j] == dna[i+1][j+1] &&	dna[i][j] == dna[i+2][j+2] && dna[i][j] == dna[i+3][j+3] &&	i == 0  ) ||
					( dna[i][j] == dna[i+1][j+1] && dna[i][j] == dna[i+2][j+2] && dna[i][j] == dna[i+3][j+3] &&	dna[i][j] == dna[i-1][j-1] ) ){
						// Sumo la mutacion 
						countMutations++; 
						
						// Devuelvo que es mutante
						if( countMutations >= MAX_MUTATIONS ){
							let result = await guardarMutante(dna, n, time, 'M', '1', countMutations);
							return mutation;
						}
				}
			}
		}
		
		// Recorro filas 

		// Comparo por diagonales
		// Para la comparacion de diagonales segun grafico excel 2
		for(let i=0; i < (n-3) ; i++){
			// Estoy con la primer 1 FILA 
			for(let j=3; j < n ; j++){
				// Tengo una mutacion vertical, siempre que sea mi posicion y las proximas 3 sean iguales
				// Y la anterior (salvo para la posicion inicial, no sea la misma)

				if(	( dna[i][j] == dna[i+1][j-1] &&	dna[i][j] == dna[i+2][j-2] && dna[i][j] == dna[i+3][j-3] &&	i == 0 ) ||
					( dna[i][j] == dna[i+1][j-1] && dna[i][j] == dna[i+2][j-2] && dna[i][j] == dna[i+3][j-3] &&	dna[i][j] == dna[i-1][j+1] ) ){
						// Sumo la mutacion 
						countMutations++; 
						
						// Devuelvo que es mutante
						if( countMutations >= MAX_MUTATIONS ){
							let result = await guardarMutante(dna, n, time, 'M', '1', countMutations);
							return mutation;
						}
				}
			}
		}


		// Si llegue hasta aca, es porque no deberia ser mutante, es decir la cantida de mutaciones tendria que ser 0, 1 o 2 
		// Devuelvo que es mutante
		if( countMutations >= MAX_MUTATIONS ){
			let result = await guardarMutante(dna, n, time, 'M', '1', countMutations);
			return mutation;
		}else{
			let result = await guardarMutante(dna, n, time, 'H', '1', countMutations);
			return human;
		}

	}catch(err){
		console.info(err);
	}
	
}

// Servicio 2 para saber si un dna es humano o mutante 
const mutantM2 = async (data) => {

	/*
	 *	Validacion de datos
	 *	Esta parte podria mejorarse mas, pero no hace a la esencia del enunciado
	 */

	// Defino la estrategia de validacion de los datos
	const validationSchema = {
		dna: joi.required(),								
	};

	// Valido los datos del request
	let validatedData = await joiWrapper.validateData(data, validationSchema);

	validatedData = JSON.parse(JSON.stringify(validatedData));

	if (validatedData.hasOwnProperty('status')) {
		// Error de validacion
		return validatedData;
	}


	try{
		
		
		// Es un elemento que contiene una cantidad de arrays segun la dimension N de una matriz de NxN.
		// Cada elemento tiene N caracteres que pueden ser A, T, C o G
		let dna = data.dna; 

		// Obtengo el N
		let n = dna.length;

		// Si el N es menor a 4, ya se que es mutante 
		if( n < 4 ){
			let result = await guardarMutante(dna, n, time, 'M', '2', 0);
			return {
				status: 'OK',
				type: 	'MUTANTE_1',
				msg:	'Es mutante porque su dimension es menor a 4'
			};
		}

		

		// Como la matriz es de NxN
		//	ATGCGA
		//	CAGTGC
		//	TTATGT
		//	AGAAGG
		//	CCCCTA
		//	TCACTG

		// Inicio la cantidad de mutaciones
		let countMutations = 0;
		
		// Inicio el maximo interesante a buscar para las diagonales
		let maxBus = n - 3;

		// Decalor un array de matriz de mutaciones
		let matrizMutaciones = [];

		// Creo e inicializo la matriz de mutaciones 
		for(let i=0; i < n; i++){
			let arrayEmpty = [];

			for(let j=0; j < n; j++){
				arrayEmpty.push('0');
			}
			
			matrizMutaciones.push(arrayEmpty);
		}
		
		// Metodo 2
		
		// Tomo el tiempo donde inicia el metodo
		const time = performance.now();

		// Recorro las filas del objeto
		for(let i=0; i < n ; i++){
			// Recorro las columnas 
			for(let j=0; j < n; j++){
				// Tengo que analizar si es mutante 

				// 	Analizo si es mutante horizontal 
				//		Reviso si puede tener mutante horizontal
				if( j < maxBus){ 
					//	Reviso si tiene mutacion 
					if(	dna[i][j] == dna[i][j+1] && dna[i][j] == dna[i][j+2] && dna[i][j] == dna[i][j+3] ){
						//	Tiene una posible mutacion a horizontal 

						//	Reviso si no tiene informacion previa la matriz de mutaciones
						if(matrizMutaciones[i][j] == '0'){
							// No hay informacion y en esa caso es mutante
							
							// Sumo la mutacion 
							countMutations++; 
						
							// Devuelvo que es mutante
							if( countMutations >= MAX_MUTATIONS ){
								let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
								return mutation;
							}

							// Seteo que es mutante
							matrizMutaciones[i][j] = '3';
							
							// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
							if( matrizMutaciones[i][j+1] == '0' ){ matrizMutaciones[i][j+1] = '2'; }

							if( matrizMutaciones[i][j+2] == '0' ){ matrizMutaciones[i][j+2] = '2'; }

							if( matrizMutaciones[i][j+3] == '0' ){ matrizMutaciones[i][j+3] = '2'; }
							
						}

						// Tengo que tener informacion que solo puede ser 2 o 3 
						// Si es un 2
						//		Horizontalmente ya estaba contagiado, sigue contagiado horizontalmente en 2 
						// Si es un 3
						//		No fue seteado antes, asi que tiene una mutacion detectada 
					}
				}

				//	Analizo si es mutante vetical 
				//		Reviso si puede tener mutaante vertical 
				if( i < maxBus ){
					//	Reviso si tiene mutacion 
					if(	dna[i][j] == dna[i+1][j] && dna[i][j] == dna[i+2][j] && dna[i][j] == dna[i+3][j] ){
						// Tiene una posible mutacion vertical 

						// Reviso si no tiene informacion previa la matriz de mutaciones 
						if( matrizMutaciones[i][j] == '0' ){
							//	No hay informacion y en este caso es mutante 

							// Sumo la mutacion 
							countMutations++; 

							// Devuelvo que es mutante
							if( countMutations >= MAX_MUTATIONS ){
								let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
								return mutation;
							}

							// Seteo que es mutante 
							matrizMutaciones[i][j] = '3';
							
							// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
							if( matrizMutaciones[i+1][j] == '0' ){ matrizMutaciones[i+1][j] = '2'; }

							if( matrizMutaciones[i+2][j] == '0' ){ matrizMutaciones[i+2][j] = '2'; }

							if( matrizMutaciones[i+3][j] == '0' ){ matrizMutaciones[i+3][j] = '2'; }

							//break;
						}
						// Tengo que tener informacion que solo puede ser 2 o 3 
						// Si es un 2
						//		Horizontalmente ya estaba contagiado, sigue contagiado horizontalmente en 2 
						// Si es un 3
						//		No fue seteado antes, asi que tiene una mutacion detectada 
						
					}
				}

				// 	Analizo si es mutante diagonal para lado derecho
				//		Reviso si puede tener mutante diagonal derecha 
				if( i < maxBus && j < maxBus ){
					//	Reviso si tiene mutacion
					if( dna[i][j] == dna[i+1][j+1] 	&&	dna[i][j] == dna[i+2][j+2] && dna[i][j] == dna[i+3][j+3] ){
						// Tiene una posible mutacion en diagonal derecha 

						// Analizo los casos segun lo que tiene seteado la matriz de informacion 
						switch( matrizMutaciones[i][j] ){
							case '0':	// Reviso si no tiene informacion previa la matriz de mutaciones 
									//	No hay informacion y en este caso es mutante 

									// Sumo la mutacion 
									countMutations++; 
									
									// Devuelvo que es mutante
									if( countMutations >= MAX_MUTATIONS ){
										let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
										return mutation;
									}

									// Seteo que es mutante 
									matrizMutaciones[i][j] = '3';
									
									// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
									if( matrizMutaciones[i+1][j+1] == '0' ){ matrizMutaciones[i+1][j+1] = '2'; }

									if( matrizMutaciones[i+2][j+2] == '0' ){ matrizMutaciones[i+2][j+2] = '2'; }

									if( matrizMutaciones[i+3][j+3] == '0' ){ matrizMutaciones[i+3][j+3] = '2'; }

									break;

							case '2':	// 	Si tenia de informacion 2, es una celula infectada por otra, que puede ser por una mutacion previa en este orden, o por una mutacion hacia la diagonal
									// Solo me importa saber si hay mutacion diagonal genuina, para eso, tambien descartamos que no haya informacion previa
									// entonces, podemos evaluar la informacion diagonal es la misma letra o no, si es distinta, es una nueva mutante 
									
									if( i == 0 || dna[i][j] != dna[i-1][j-1] ){
										// Sumo la mutacion 
										countMutations++;

										// Devuelvo que es mutante
										if( countMutations >= MAX_MUTATIONS ){
											let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
											return mutation;
										}

										// Seteo que es mutante 
										matrizMutaciones[i][j] = '3';
										// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
										if( matrizMutaciones[i+1][j+1] == '0' ){ matrizMutaciones[i+1][j+1] = '2'; }

										if( matrizMutaciones[i+2][j+2] == '0' ){ matrizMutaciones[i+2][j+2] = '2'; }

										if( matrizMutaciones[i+3][j+3] == '0' ){ matrizMutaciones[i+3][j+3] = '2'; }
									}

									break;

							case '3':	// Si tenia de informacion 3, es por que tiene otra mutacion previa, es decir tengo que sumar una mutacion mas y setear las infectadas 
									// Sumo la mutacion 
									countMutations++; 

									// Devuelvo que es mutante
									if( countMutations >= MAX_MUTATIONS ){
										let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
										return mutation;
									}

									// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
									if( matrizMutaciones[i+1][j+1] == '0' ){ matrizMutaciones[i+1][j+1] = '2'; }

									if( matrizMutaciones[i+2][j+2] == '0' ){ matrizMutaciones[i+2][j+2] = '2'; }

									if( matrizMutaciones[i+3][j+3] == '0' ){ matrizMutaciones[i+3][j+3] = '2'; }
									
									break;

							default:	// No deberia llegar nunca aca
									break;


						}

					}
				}

				// 	Analizo si es mutante diagonal para lado izquierdo
				//		Reviso si puede tener mutante diagonal izquierda 
				if( i < maxBus && j > 2 && j < maxBus ){
					//	Reviso si tiene mutacion
					if( dna[i][j] == dna[i+1][j-1] 	&&	dna[i][j] == dna[i+2][j-2] && dna[i][j] == dna[i+3][j-3] ){
						// Tiene una posible mutacion en diagonal izquierda 

						// Analizo los casos segun lo que tiene seteado la matriz de informacion 
						switch( matrizMutaciones[i][j] ){
							case '0':	// Reviso si no tiene informacion previa la matriz de mutaciones 
									//	No hay informacion y en este caso es mutante 

									// Sumo la mutacion 
									countMutations++;

									// Devuelvo que es mutante
									if( countMutations >= MAX_MUTATIONS ){
										let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
										return mutation;
									}

									// Seteo que es mutante 
									matrizMutaciones[i][j] = '3';
									
									// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
									if( matrizMutaciones[i+1][j-1] == '0' ){ matrizMutaciones[i+1][j-1] = '2'; }

									if( matrizMutaciones[i+2][j-2] == '0' ){ matrizMutaciones[i+2][j-2] = '2'; }

									if( matrizMutaciones[i+3][j-3] == '0' ){ matrizMutaciones[i+3][j-3] = '2'; }

									break;

							case '2':	// 	Si tenia de informacion 2, es una celula infectada por otra, que puede ser por una mutacion previa en este orden, o por una mutacion nueva hacia la diagonal
									// Solo me importa saber si hay mutacion diagonal genuina, para eso, tambien descartamos que no haya informacion previa
									// entonces, podemos evaluar la informacion diagonal es la misma letra o no, si es distinta, es una nueva mutante 
							
									if( i == 0 || dna[i][j] != dna[i-1][j+1] ){
										// Sumo la mutacion 
										countMutations++; 

										// Devuelvo que es mutante
										if( countMutations >= MAX_MUTATIONS ){
											let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
											return mutation;
										}

										// Seteo que es mutante 
										matrizMutaciones[i][j] = '3';

										// Seteo las celulas contagiadas, si no tienen informacion previa
										if( matrizMutaciones[i+1][j+1] == '0' ){ matrizMutaciones[i+1][j+1] = '2'; }

										if( matrizMutaciones[i+2][j+2] == '0' ){ matrizMutaciones[i+2][j+2] = '2'; }

										if( matrizMutaciones[i+3][j+3] == '0' ){ matrizMutaciones[i+3][j+3] = '2'; }
									}
									break;
									
							case '3':	// Si tenia informacion 3, es por que tiene otra mutacion previa, es decir tengo que sumar una mutacion mas y setear las infectadas 
									
									// Sumo la mutacion 
									countMutations++; 

									// Devuelvo que es mutante
									if( countMutations >= MAX_MUTATIONS ){
										let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
										return mutation;
									}

									// Seteo las celulas contagiadas, si no tienen informacion previa, o si su estado es 1 
									if( matrizMutaciones[i+1][j-1] == '0' ){ matrizMutaciones[i+1][j-1] = '2'; }

									if( matrizMutaciones[i+2][j-2] == '0' ){ matrizMutaciones[i+2][j-2] = '2'; }

									if( matrizMutaciones[i+3][j-3] == '0' ){ matrizMutaciones[i+3][j-3] = '2'; }
									break;
							
							default:	// No deberia llegar nunca aca
									break;


						}

					}
				}
			}
			
		}

		// Si llegue hasta aca, es porque no deberia ser mutante, es decir la cantida de mutaciones tendria que ser 0, 1 o 2 
		// Devuelvo que es mutante
		if( countMutations >= MAX_MUTATIONS ){
			let result = await guardarMutante(dna, n, time, 'M', '2', countMutations);
			return mutation;
		}else{
			let result = await guardarMutante(dna, n, time, 'H', '2', countMutations);
			return human;
		}

	}catch(err){
		console.info(err);
	}
	
}

// Servicio para saber las estadisticas 
const stats = async (data) => {
	try{
		// Obtengo los humanos 
		let countHumans = await applicationModel.getCount('H');
		
		// Obtengo los mutantes 
		let countMutants = await applicationModel.getCount('M');
		
		// Calculo el ratio 
		let ratio = countMutants / countHumans;
		
		return {
			status: 'OK',
			count_muntant_dna:	countMutants,
			count_human_dna: countHumans,
			ratio: ratio
		}

	}catch(err){
		console.info(err);
	}
}

// Funcion para guardar la informacion del DNA recibido
async function guardarMutante(dna, n, start, mutacion, method, countMutations){
	// Finalizo el tiempo 
	const end = performance.now();

	// Calculo la diferencia 
	let diff = end - start;

	// Guardo en la base de datos .
	let result = await applicationModel.saveDNA(n, dna, mutacion, method, diff, countMutations);

	// Devuelvo 
	return true;
}

module.exports = {
  helloWorld,
  mutantM1,
  mutantM2,
  stats
};