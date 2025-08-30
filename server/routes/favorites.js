const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/:id', favoriteController.toggleFavorite);
router.get('/user', favoriteController.getUserFavorites);
router.get('/:id/status', favoriteController.checkFavoriteStatus);

module.exports = router;


