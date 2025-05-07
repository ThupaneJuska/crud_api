const express = require('express');
const router = express.Router();
const MedicationController = require('../controllers/medicationController');
const upload = require('../middleware/upload');

// POST with image
router.post('/add-medication', upload.single('image'), MedicationController.addMedication);
router.put('/update-medication/:id', upload.single('image'), MedicationController.updateMedication);
router.get('/get-medications', MedicationController.getMedications);
router.delete('/delete-medication/:id', MedicationController.deleteMedication);

module.exports = router;
