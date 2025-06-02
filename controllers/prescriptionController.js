const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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
  const { prescription_date, dosage_instructions, patient_id, medication_id, staff_id } = req.body;

  if (!prescription_date || !dosage_instructions || !patient_id || !medication_id || !staff_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Step 1: Check current stock of the medication
    const medResult = await db.query('SELECT name, stock_count FROM Medications WHERE id = $1', [medication_id]);
    if (medResult.rows.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    const { name: medicationName, stock_count } = medResult.rows[0];

    // Step 2: Insert the prescription
    const result = await db.query(
      'INSERT INTO Prescriptions (prescription_date, dosage_instructions, patient_id, medication_id, staff_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [prescription_date, dosage_instructions, patient_id, medication_id, staff_id]
    );

    // Step 3: Check if stock is low and send email to staff
    if (stock_count <= 10) {
      const staffResult = await db.query('SELECT email, name FROM Staff WHERE id = $1', [staff_id]);
      if (staffResult.rows.length > 0) {
        const { email, name } = staffResult.rows[0];

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Low Stock Alert',
          text: `Hi ${name},\n\nThe stock for medication "${medicationName}" is low (current count: ${stock_count}). Please consider restocking.\n\nRegards,\nSystem`
        };

        await transporter.sendMail(mailOptions);
      }
    }

    res.status(201).json({ message: 'Prescription added successfully', prescription: result.rows[0] });
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

