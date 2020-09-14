/*
 *	En este archivo declaro todas las rutas a la aplicacion, y redirijo las peticiones a los controllers correspondientes
 */
 
/*
 *	1) Importacion de dependencias
 */

// Framework para aplicaciones web 
const express = require('express');															

// Importacion de controllers
const applicationController = require('../src/controllers/applicationController.js');

// Instanciado
const router = express.Router();	

/*
 *	2) Rutas
 */
router.route('/').get(applicationController.helloWorld);
router.route('/info').get(applicationController.index);
router.route('/api/hello').get(applicationController.helloWorld);
router.route('/api/mutant').post(applicationController.mutantM2);
router.route('/api/mutant1').post(applicationController.mutantM1);
router.route('/api/mutant2').post(applicationController.mutantM2);
router.route('/api/stats').get(applicationController.stats);

module.exports = router;