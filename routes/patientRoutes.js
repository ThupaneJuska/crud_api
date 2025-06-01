// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Define route for fetching all patients
router.get('/', patientController.getAllPatients);
router.put('/:id', patientController.updatePatient);
router.post('/', patientController.addPatient);

// Export router
module.exports = router;
