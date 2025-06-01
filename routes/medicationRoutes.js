const express = require('express');
const router = express.Router();
const MedicationController = require('../controllers/medicationController');
const upload = require('../middleware/upload');

// Add a medication (with optional image)
router.post('/add-medication', upload.single('image'), MedicationController.addMedication);

// Update a medication (with optional new image)
router.put('/update-medication/:id', upload.single('image'), MedicationController.updateMedication);

// Get all medications
router.get('/get-medications', MedicationController.getMedications);

// Delete a medication
router.delete('/delete-medication/:id', MedicationController.deleteMedication);

module.exports = router;
