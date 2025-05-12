const db = require('../config/db');
// const bcrypt = require('bcryptjs');

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
  const { name, role, contact_number, email, password } = req.body;

  if (!name || !role || !contact_number || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields: name, role, contact_number, email, or password' });
  }

  try {
    // Check if a staff member with the same email already exists
    const existingUser = await db.query('SELECT * FROM Staff WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'A staff member with this email already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO Staff (name, role, contact_number, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, role, contact_number, email, hashedPassword]
    );

    res.status(201).json({ message: 'Staff member added successfully', staff: result.rows[0] });

  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getStaffByEmail } = require('../models/staffModel');

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await getStaffByEmail(email);
    if (!staff) {
      return res.status(400).json({ message: 'Staff not found' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ staffId: staff.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token , name: staff.name, role: staff.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
