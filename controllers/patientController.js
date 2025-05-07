// patientController.js
const db = require('../config/db');

// Fetch all patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Patient');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params; // 👈 use `id` because your route is /patients/:id
  const { name, age, gender, contact } = req.body;

  try {
    const result = await db.query(
      `UPDATE Patient 
       SET name = $1, age = $2, gender = $3, contact = $4 
       WHERE patient_id = $5 
       RETURNING *`, // 👈 match your column name
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
