const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Make sure it exports router

dotenv.config();

const app = express();

// === CORS Configuration ===
const corsOptions = {
  origin: 'http://localhost:3000',  // Ensure this is set correctly
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Ensure you are allowing cookies if needed
};
app.use(cors(corsOptions));  // Enable CORS with the configuration


// === Middleware ===
app.use(helmet()); // Security headers
app.use(express.json());
app.use(cookieParser());

// === CSRF Protection ===


// CSRF Token Test Route (optional)
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// === Rate Limiting ===
const limiter = rateLimit({
  windowMs: 25 * 60 * 1000, // 25 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});
app.use(limiter);

// === Swagger Configuration ===
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer International Payments Portal API',
      version: '1.0.0',
      description: 'API documentation for the Customer International Payments Portal',
      contact: {
        name: 'Your Name',
        email: 'your-email@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://yourbackend.com/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production'
          ? 'Production Server'
          : 'Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// === MongoDB Connection ===
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    setTimeout(() => {
      mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }, 5000);
  });

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
