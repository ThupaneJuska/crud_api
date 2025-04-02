const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const medicationRoutes = require('./routes/medicationRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api/medications', medicationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
