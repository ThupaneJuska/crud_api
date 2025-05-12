const pool = require('../config/db'); // Postgres pool

// Get staff by email
const getStaffByEmail = async (email) => {
  const query = 'SELECT * FROM staff WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0]; // Return first staff member
};

module.exports = { getStaffByEmail };
