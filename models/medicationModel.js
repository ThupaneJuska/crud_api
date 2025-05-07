const db = require('../config/db');

const MedicationModel = {
  addMedication: async (medicationData) => {
    const { name, dosage, quantity, stock_count, threshold, received_count, image_url } = medicationData;
    const query = `
      INSERT INTO medication (name, dosage, quantity, stock_count, threshold, received_count, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [name, dosage, quantity, stock_count, threshold, received_count, image_url];
    const result = await db.query(query, values);
    return result.rows[0];  // Return added medication
  },

  getAllMedications: async () => {
    const query = 'SELECT * FROM medication';
    const result = await db.query(query);
    return result.rows;
  },

  deleteMedication: async (id) => {
    const query = 'DELETE FROM medication WHERE medication_id = $1 RETURNING *';
    const values = [id];
    const result = await db.query(query, values);
    return result.rowCount;
  },

  updateMedication: async (id, medicationData) => {
    const { name, dosage, quantity, stock_count, threshold, received_count, image_url } = medicationData;
    const query = `
      UPDATE medication
      SET name = $1, dosage = $2, quantity = $3, stock_count = $4, threshold = $5, received_count = $6, image_url = $7
      WHERE medication_id = $8 RETURNING *;
    `;
    const values = [name, dosage, quantity, stock_count, threshold, received_count, image_url, id];
    const result = await db.query(query, values);
    return result.rows[0];  // Return updated medication
  },

  // Other methods...
};

module.exports = MedicationModel;
