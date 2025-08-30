const express = require('express');
const { body } = require('express-validator');
const animeController = require('../controllers/animeController');
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { uploadAnime, processUploadedFiles } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Validation middleware
const validateAnimeUpload = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('type')
    .isIn(['video', 'novel'])
    .withMessage('Type must be either video or novel'),
  body('category')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
];

const validateAnimeUpdate = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Description cannot be empty'),
  body('type')
    .optional()
    .isIn(['video', 'novel'])
    .withMessage('Type must be either video or novel'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
];

// Public routes
router.get('/list', animeController.getAnimeList);
router.get('/search', animeController.searchAnime);
router.get('/:id', animeController.getAnimeById);

// Admin only routes
router.post('/upload', 
  authMiddleware, 
  adminMiddleware, 
  uploadAnime, 
  processUploadedFiles, 
  validateAnimeUpload, 
  animeController.uploadAnime
);

router.put('/:id', 
  authMiddleware, 
  adminMiddleware, 
  uploadAnime, 
  processUploadedFiles, 
  validateAnimeUpdate, 
  animeController.updateAnime
);

router.delete('/:id', 
  authMiddleware, 
  adminMiddleware, 
  animeController.deleteAnime
);

// Favorites shortcut under anime path
router.post('/:id/favorite', authMiddleware, favoriteController.toggleFavorite);

module.exports = router;
