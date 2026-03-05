// Import required packages
const express = require('express');          // Express framework to create the server
const mongoose = require('mongoose');        // Mongoose to connect MongoDB
const cors = require('cors');                // CORS middleware to allow frontend requests
const path = require('path');                // Path module for handling file paths
require('dotenv').config();                  // Load environment variables from .env file

// Import route files
const authRoutes = require('./routes/auth');     // Authentication routes (login, register)
const imageRoutes = require('./routes/images');  // Image related routes (upload, gallery etc.)

// Create express application
const app = express();

// Use PORT from environment variable (Render provides this) or default to 5000
const PORT = process.env.PORT || 5000;

/*
 CORS Configuration
 This allows your frontend (Vercel) and local development server
 to send requests to this backend.
*/
app.use(cors({
  origin: [
    "https://artpixel-gallery.vercel.app",   // Production frontend (Vercel)
    "http://localhost:5173"                  // Local React development server
  ],
  credentials: true                          // Allows cookies / authorization headers
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

/*
 Serve static files from uploads folder
 This allows images to be accessed like:
 https://your-backend-url/uploads/image.jpg
*/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*
 Connect to MongoDB Atlas
 Connection string is stored in environment variable MONGO_URI
*/
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);      // Authentication API endpoints
app.use('/api/images', imageRoutes);   // Image related API endpoints

// Default route to check if API is running
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Virtual Art Gallery API' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});