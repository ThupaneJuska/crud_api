const db = require('../config/db');

// Get all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM prescription');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM get_prescription_by_id($1)', [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a prescription
exports.addPrescription = async (req, res) => {
    console.log('Adding prescription...');
  const { prescription_date, dosage_instructions, patient_id, medication_id, staff_id } = req.body;
  try {
    await db.query('CALL add_prescription($1, $2, $3, $4, $5)', [prescription_date, dosage_instructions, patient_id, medication_id, staff_id]);
    res.status(201).json({ message: 'Prescription added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Fetch all patients
exports.getAllPatients = async (req, res) => {
    try {
      const result = await db.query('SELECT patient_id, name FROM Patient');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Fetch all medications
  exports.getAllMedications = async (req, res) => {
    try {
      const result = await db.query('SELECT medication_id, name FROM Medication');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Fetch all staff
  exports.getAllStaff = async (req, res) => {
    try {
      const result = await db.query('SELECT staff_id, name FROM Staff');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

