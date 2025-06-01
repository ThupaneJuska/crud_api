const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const medicationRoutes = require('./routes/medicationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const patientRoutes = require('./routes/patientRoutes'); 
const staffRoutes = require('./routes/staffRoutes');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload folder exists
const uploadMedicationsDir = path.join(__dirname, 'uploads/medications');
if (!fs.existsSync(uploadMedicationsDir)) {
  fs.mkdirSync(uploadMedicationsDir, { recursive: true });
  console.log('✅ Created uploads/medications directory.');
}

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔒 Block ngrok inspection URLs (optional)
app.use((req, res, next) => {
  if (req.url.startsWith('/_ngrok') || req.url.startsWith('/__ngrok')) {
    return res.status(403).send('Access to ngrok inspection is disabled');
  }
  next();
});

// Optional: suppress ngrok browser warning header
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('Root (/) route accessed');
  res.send('Welcome to my backend');
});

// API routes
app.use('/api/medications', medicationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/staff', staffRoutes);

// Fallback route
app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
