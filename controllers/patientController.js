const db = require('../config/db');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Patient');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new patient
exports.addPatient = async (req, res) => {
  const { name, age, gender, contact, sickness } = req.body;

  // Basic validation
  if (!name || !age || !gender || !contact || !sickness) {
    return res.status(400).json({ error: 'All fields are required, including sickness' });
  }

  try {
    const result = await db.query(
      `INSERT INTO Patient (name, age, gender, contact, sickness)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, age, gender, contact, sickness]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('🔥 Error adding patient:', error);
    res.status(500).json({ error: error.message });
  }
};


// Update a patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, contact } = req.body;

  try {
    const result = await db.query(
      `UPDATE Patient 
       SET name = $1, age = $2, gender = $3, contact = $4 
       WHERE patient_id = $5 
       RETURNING *`,
      [name, age, gender, contact, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating patient:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
