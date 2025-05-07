const db = require('../config/db');

// Fetch all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const result = await db.query('SELECT staff_id, name FROM Staff');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllStaffDetails = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Staff');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching full staff details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteStaff = async (req, res) => {
  const staffId = req.params.id;

  try {
    await db.query('CALL delete_staff_and_prescriptions($1)', [staffId]);
    res.json({ message: 'Staff and related prescriptions deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff with procedure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new staff member
exports.addStaff = async (req, res) => {
  const { name, role, contact_number } = req.body;

  if (!name || !role || !contact_number) {
    return res.status(400).json({ error: 'Missing required fields: name, role, or contact_number' });
  }

  try {
    const result = await db.query(
      'INSERT INTO Staff (name, role, contact_number) VALUES ($1, $2, $3) RETURNING *',
      [name, role, contact_number]
    );
    res.status(201).json({ message: 'Staff member added successfully', staff: result.rows[0] });
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
