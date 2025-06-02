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
  console.log('Adding prescription...');
  const { prescription_date, dosage_instructions, patient_id, medication_id, staff_id } = req.body;

  try {
    // Step 1: Get current stock of the medication
    const medRes = await db.query('SELECT name, stock_count FROM Medication WHERE medication_id = $1', [medication_id]);
    if (medRes.rows.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    const { name: medicationName, stock_count } = medRes.rows[0];

    // Step 2: Call stored procedure to add the prescription
    await db.query('CALL add_prescription($1, $2, $3, $4, $5)', [
      prescription_date,
      dosage_instructions,
      patient_id,
      medication_id,
      staff_id
    ]);

    // Step 3: If stock is low (≤ 10), send an email to the staff
    if (stock_count <= 10) {
      const staffRes = await db.query('SELECT email, name FROM Staff WHERE staff_id = $1', [staff_id]);
      if (staffRes.rows.length > 0) {
        const { email, name } = staffRes.rows[0];

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: '⚠️ Low Stock Alert',
          text: `Hi ${name},\n\nPlease note: The stock for medication "${medicationName}" is low (stock count: ${stock_count}).\n\nRegards,\nInventory Management System`
        };

        await transporter.sendMail(mailOptions);
        console.log('Low stock email sent to', email);
      }
    }

    res.status(201).json({ message: 'Prescription added successfully' });

  } catch (err) {
    console.error('Error adding prescription:', err);
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

