const pool = require('../config/db');

const MedicationModel = {
  addMedication: async ({ name, dosage, quantity, stock_count, threshold, received_count }) => {
    const result = await pool.query(
      `INSERT INTO Medication (name, dosage, quantity, stock_count, threshold, received_count)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, dosage, quantity, stock_count, threshold, received_count]
    );
    return result.rows[0];
  },

  getAllMedications: async () => {
    const result = await pool.query('SELECT * FROM Medication');
    return result.rows;
  },

  deleteMedication: async (id) => {
    const result = await pool.query('DELETE FROM Medication WHERE medication_id = $1', [id]);
    return result.rowCount;
  },

  updateMedication: async (id, { name, dosage, quantity, stock_count, threshold, received_count }) => {
    const result = await pool.query(
      'UPDATE Medication SET name = $1, dosage = $2, quantity = $3, stock_count = $4, threshold = $5, received_count = $6 WHERE medication_id = $7 RETURNING *',
      [name, dosage, quantity, stock_count, threshold, received_count, id]
    );
    return result.rows[0];
  },
};

module.exports = MedicationModel;
