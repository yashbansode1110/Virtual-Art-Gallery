const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/profile', protect, authController.getProfile);

// Update user profile (protected route)
router.put('/profile', protect, upload.single('profileImage'), authController.updateProfile);

module.exports = router; 