const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', imageController.getImages);
router.get('/featured', imageController.getFeaturedImages);
router.get('/:id', imageController.getImageById);

// Protected routes (require login)
router.post('/upload', protect, upload.single('image'), imageController.uploadImage);
router.delete('/:id', protect, imageController.deleteImage);
router.put('/:id/like', protect, imageController.likeImage);
router.post('/:id/comment', protect, imageController.addComment);

// Admin routes
router.put('/:id/featured', protect, admin, imageController.toggleFeatured);

module.exports = router; 