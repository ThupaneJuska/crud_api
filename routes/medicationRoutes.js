const express = require('express');
const router = express.Router();
const MedicationController = require('../controllers/medicationController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/medications/add-medication:
 *   post:
 *     summary: Add a new medication
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Medication created successfully
 */
router.post('/add-medication', upload.single('image'), MedicationController.addMedication);

/**
 * @swagger
 * /api/medications/update-medication/{id}:
 *   put:
 *     summary: Update a medication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medication ID
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Medication updated successfully
 */
router.put('/update-medication/:id', upload.single('image'), MedicationController.updateMedication);

/**
 * @swagger
 * /api/medications/get-medications:
 *   get:
 *     summary: Get all medications
 *     responses:
 *       200:
 *         description: A list of medications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/get-medications', MedicationController.getMedications);

/**
 * @swagger
 * /api/medications/delete-medication/{id}:
 *   delete:
 *     summary: Delete a medication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medication ID to delete
 *     responses:
 *       200:
 *         description: Medication deleted successfully
 */
router.delete('/delete-medication/:id', MedicationController.deleteMedication);

module.exports = router;
