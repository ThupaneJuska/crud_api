const express = require('express');
const MedicationController = require('../controllers/medicationController');

const router = express.Router();

router.post('/add-medication', MedicationController.addMedication);
router.get('/get-medications', MedicationController.getMedications);
router.delete('/delete-medication/:id', MedicationController.deleteMedication);
router.put('/update-medication/:id', MedicationController.updateMedication);

module.exports = router;
