const MedicationModel = require('../models/medicationModel');

const MedicationController = {
  addMedication: async (req, res) => {
    try {
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
      const deleted = await MedicationModel.deleteMedication(req.params.id);
      if (deleted === 0) return res.status(404).json({ message: 'Medication not found' });

      res.json({ message: 'Medication deleted successfully' });
    } catch (err) {
      console.error('Error deleting medication:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateMedication: async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/medications/${req.file.filename}` : null;
      const medicationData = { ...req.body, image_url: imageUrl };

      const updated = await MedicationModel.updateMedication(req.params.id, medicationData);
      if (!updated) return res.status(404).json({ message: 'Medication not found' });

      res.status(200).json({ message: 'Medication updated successfully', medication: updated });
    } catch (error) {
      console.error('Error updating medication:', error);
      res.status(500).json({ message: 'Failed to update medication' });
    }
  }
};

module.exports = MedicationController;
