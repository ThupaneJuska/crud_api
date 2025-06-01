const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const medicationRoutes = require('./routes/medicationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const patientRoutes = require('./routes/patientRoutes'); 
const staffRoutes = require('./routes/staffRoutes');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// Routes
app.use('/api/medications', medicationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/staff', staffRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
