const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.get('/', prescriptionController.getAllPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionById);
router.post('/', prescriptionController.addPrescription);
router.get('/patients', prescriptionController.getAllPatients);
router.get('/medications', prescriptionController.getAllMedications);
router.get('/staff', prescriptionController.getAllStaff);


module.exports = router;
