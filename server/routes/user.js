const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadAvatar, processUploadedFiles } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation middleware
const validateProfileUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
];

// Routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', validateProfileUpdate, uploadAvatar, processUploadedFiles, userController.updateUserProfile);
router.get('/uploads', userController.getUserUploads);

module.exports = router;


