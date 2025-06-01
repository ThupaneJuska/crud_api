const corsOptions = {
  origin: '*', // Allows requests from any origin
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE', 'PUT'],
 allowedHeaders: [
    'Content-Type',
    'Authorization',
    'ngrok-skip-browser-warning' // 👈 Add this line
  ],
  optionsSuccessStatus: 200,
  
};

module.exports = corsOptions;
