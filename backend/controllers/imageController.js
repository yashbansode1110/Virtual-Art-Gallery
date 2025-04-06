const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

// Upload a new image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const { title, description, category, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const newImage = await Image.create({
      title,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      category,
      tags: tagsArray,
      uploaderId: req.user._id
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all images with filters
exports.getImages = async (req, res) => {
  try {
    const { category, search, featured, sortBy } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Set sorting options
    let sort = {};
    if (sortBy === 'newest') {
      sort = { uploadDate: -1 };
    } else if (sortBy === 'oldest') {
      sort = { uploadDate: 1 };
    } else if (sortBy === 'popular') {
      sort = { 'likes.length': -1 };
    } else {
      sort = { uploadDate: -1 }; // Default sort by newest
    }

    // Execute query with pagination
    const images = await Image.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('uploaderId', 'name profileImage')
      .populate('comments.user', 'name profileImage');

    // Get total count for pagination
    const totalImages = await Image.countDocuments(query);

    res.json({
      images,
      page,
      pages: Math.ceil(totalImages / limit),
      totalImages
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploaderId', 'name profileImage')
      .populate('comments.user', 'name profileImage');
    
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Get image by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user is the uploader or an admin
    if (image.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }
    
    // Delete image file from server
    const filePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete image from database
    await image.remove();
    
    res.json({ message: 'Image removed' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/unlike image
exports.likeImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user has already liked the image
    const alreadyLiked = image.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      // Remove like
      image.likes = image.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Add like
      image.likes.push(req.user._id);
    }
    
    await image.save();
    
    res.json({ likes: image.likes });
  } catch (error) {
    console.error('Like image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to image
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const newComment = {
      user: req.user._id,
      text,
      date: Date.now()
    };
    
    image.comments.unshift(newComment);
    await image.save();
    
    // Get updated image with populated comments
    const updatedImage = await Image.findById(req.params.id)
      .populate('comments.user', 'name profileImage');
    
    res.json(updatedImage.comments);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured images for home page
exports.getFeaturedImages = async (req, res) => {
  try {
    const featuredImages = await Image.find({ featured: true })
      .limit(6)
      .populate('uploaderId', 'name profileImage');
    
    res.json(featuredImages);
  } catch (error) {
    console.error('Get featured images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle featured status (admin only)
exports.toggleFeatured = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    image.featured = !image.featured;
    const updatedImage = await image.save();
    
    res.json(updatedImage);
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 