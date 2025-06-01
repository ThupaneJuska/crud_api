const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicationModel = require('../models/medicationModel');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/medications');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Folder to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  }
});

const upload = multer({ storage });

const MedicationController = {
  addMedication: async (req, res) => {
    try {
      console.log('Incoming POST with file:', req.file); // ✅ Debug
      const imageUrl = req.file ? `/uploads/medications/${req.file.filename}` : null;
      const medicationData = { ...req.body, image_url: imageUrl };

      const medication = await MedicationModel.addMedication(medicationData);
      res.status(201).json({ message: 'Medication added successfully', medication });
    } catch (err) {
      console.error('Error inserting medication:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getMedications: async (req, res) => {
    try {
      const medications = await MedicationModel.getAllMedications();
      res.status(200).json({ medications });
    } catch (err) {
      console.error('Error fetching medications:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteMedication: async (req, res) => {
    try {
      const deletedRows = await MedicationModel.deleteMedication(req.params.id);
      if (deletedRows === 0) return res.status(404).json({ message: 'Medication not found' });

      res.json({ message: 'Medication deleted successfully' });
    } catch (err) {
      console.error('Error deleting medication:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateMedication: async (req, res) => {
    try {
      console.log('Incoming PUT with file:', req.file); // ✅ Debug
      const imageUrl = req.file ? `/uploads/medications/${req.file.filename}` : null;
      const medicationData = { ...req.body, image_url: imageUrl };

      const updatedMedication = await MedicationModel.updateMedication(req.params.id, medicationData);
      if (!updatedMedication) return res.status(404).json({ message: 'Medication not found' });

      res.status(200).json({ message: 'Medication updated successfully', medication: updatedMedication });
    } catch (error) {
      console.error('Error updating medication:', error);
      res.status(500).json({ message: 'Failed to update medication' });
    }
  }
};

module.exports = MedicationController;
module.exports.upload = upload; // 👈 Optional if you want to use it outside
