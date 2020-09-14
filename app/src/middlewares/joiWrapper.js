/*
 *	Implementacion propia de joi (Libreria de validaciones)
 */
 
 /*
 *	1) Importo dependencias
 */
const joi = require('joi');

// Opciones de validacion de Joi
const validationOptions = {
  abortEarly: false,	// false = devuelve todos los errores de validacion. true = solo devuelve el primer error
  allowUnknown: true,	// permite que los objetos recibidos tengan otras propiedades ademas de las especificadas en el schema.
  stripUnknown: true 	// elimina las claves que no estan especificadas en el schema una vez validado el objeto
};


// Wrapper para validacion de datos
async function validateData(data, schema, useJoiError = true) {
	return await joi.validate(data, schema, validationOptions, (err, validatedData) => {
		// Compruebo si hubo errores en la validacion
		if (err) {
			// Si los hay, le doy un formato personalizado a los errores
			let joiError = {
				status: 'VALIDATION_ERROR',
				fields: {}
			};
			
			// Recorro los errores y devuelvo string personalizado segun su tipo
			const errDetailsLength = err.details.length;

			for (let i = 0; i < errDetailsLength; i++) {
				if (!joiError.fields.hasOwnProperty(err.details[i].context.key)) {
					joiError.fields[err.details[i].context.key] = [];
				}
				
				switch (err.details[i].type) {
					case 'any.required':
						joiError.fields[err.details[i].context.key].push({
							error: 'FIELD_REQUIRED'
						});
						break;
					case 'any.allowOnly':
						joiError.fields[err.details[i].context.key].push({
							error: 'FIELD_INVALID_VALUE',
							allowedValues: err.details[i].context.valids
						});
						break;
					case 'number.integer':
						joiError.fields[err.details[i].context.key].push({
							error: 'NUMBER_IS_NOT_INTEGER'
						});
						break;
					case 'number.min':
						if (err.details[i].context.limit == 0) {
							joiError.fields[err.details[i].context.key].push({
								error: 'FIELD_REQUIRED'
							});
						} else {
							joiError.fields[err.details[i].context.key].push({
								error: 'NUMBER_BELOW_MINIMUM',
								minimumNumber: err.details[i].context.limit
							});
						}
						break;
					case 'number.max':
						joiError.fields[err.details[i].context.key].push({
							error: 'NUMBER_ABOVE_MAXIMUM',
							maximumNumber: err.details[i].context.limit
						});
						break;
					case 'string.min':
						if (err.details[i].context.limit == 1) {
							joiError.fields[err.details[i].context.key].push({
								error: 'FIELD_REQUIRED'
							});
						} else {
							joiError.fields[err.details[i].context.key].push({
								error: 'STRING_BELOW_MINIMUM',
								minimumLength: err.details[i].context.limit
							});
						}
						break;
					case 'string.max':
						joiError.fields[err.details[i].context.key].push({
							error: 'STRING_ABOVE_MAXIMUM',
							maximumLength: err.details[i].context.limit
						});
						break;
					case 'string.regex.base':
						joiError.fields[err.details[i].context.key].push({
							error: 'INVALID_DATA',
							regex: err.details[i].context.pattern.toString()
						});
						break;
					default:
						joiError.fields[err.details[i].context.key].push({
							error: 'INVALID_FIELD'
						});
				}
			}
			
			// Si alguno de los campos fallo por validacion "required" elimino todos los demas errores de validacion asociados a ese campo
			for (let property in joiError.fields) {
				if (joiError.fields.hasOwnProperty(property)) {
					let errorsLength = joiError.fields[property].length;
					for (let i = 0; i < errorsLength; i++) {
						if (joiError.fields[property][i].error == 'FIELD_REQUIRED') {
							joiError.fields[property] = [joiError.fields[property][i]];
							break;
						}
					}
				}
			}
			
			return joiError;
		}
		
		// Devuelvo el objeto ya validado
		return validatedData;
	});
}


module.exports = {
	validateData
};