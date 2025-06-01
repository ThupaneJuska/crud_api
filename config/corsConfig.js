const corsOptions = {
  origin: '*', // Allows requests from any origin
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE', 'PUT'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
