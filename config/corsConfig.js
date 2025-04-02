const allowedOrigins = ['http://localhost:4200'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE', 'PUT'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
