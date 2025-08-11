import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/db.js';
import authRoutes from './routes/auth.js';
import authV2Routes from './routes/authV2.js';
import facilitiesRoutes from './routes/facilities.js';
import bookingsRoutes from './routes/bookings.js';
import availabilityRoutes from './routes/availability.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:8081';

// Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',  // Added for current frontend port
  'http://localhost:3000',
  'http://localhost:5173',
  CLIENT_ORIGIN
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth/v2', authV2Routes);
app.use('/api', facilitiesRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

