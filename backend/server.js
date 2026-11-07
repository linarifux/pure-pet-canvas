
// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// cookie parser
import cookieParser from 'cookie-parser';

// route imports
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js'; 


// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB(); 

const app = express();

// Standard Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL
  ],
  credentials: true
}
)); // Allow requests from the frontend domain and send cookies
app.use(express.json()); // Parses incoming JSON payloads
app.use(cookieParser());

// API Route Placeholders (We will build these next)
// import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running, ready to sync with Printify.' });
});

// User Routes
app.use('/api/users', userRoutes);
// Order Routes
app.use('/api/orders', orderRoutes);
// Product Routes
app.use('/api/products', productRoutes);


// Error Handling Middleware (Must be defined AFTER all routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
