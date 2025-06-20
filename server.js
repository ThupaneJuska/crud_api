const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const medicationRoutes = require('./routes/medicationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const patientRoutes = require('./routes/patientRoutes'); 
const staffRoutes = require('./routes/staffRoutes');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medication Management API',
      version: '1.0.0',
      description: 'API documentation for managing medications, prescriptions, patients, staff, and emails',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// ngrok stuff...
// (same as you have it)

app.get('/', (req, res) => {
  console.log('Root (/) route accessed');
  res.send('Welcome to my backend');
});

// API routes
app.use('/api/medications', medicationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/email', emailRoutes);

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
});
