import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { User } from './models/User';

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leads_db')
  .then(async () => {
    console.log('Database connected');
    try {
      // Seed admin user if not exists
      const adminEmail = 'admin@gmail.com';
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const adminUser = new User({
          email: adminEmail,
          password: 'Admin@12345',
          role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user seeded successfully');
      }
    } catch (seedErr) {
      console.error('Error seeding admin user:', seedErr);
    }
  })
  .catch((err) => console.error('Database error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

export default app;
