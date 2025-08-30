const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Validation middleware
const validateComment = [
  body('comment')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
    .trim()
];

// Routes
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', authMiddleware, validateComment, commentController.addComment);

module.exports = router;
