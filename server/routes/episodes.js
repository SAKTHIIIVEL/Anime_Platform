const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { uploadAnime, processUploadedFiles } = require('../middlewares/uploadMiddleware');
const { body } = require('express-validator');
const { listEpisodes, createEpisode, updateEpisode, deleteEpisode } = require('../controllers/episodeController');

const router = express.Router({ mergeParams: true });

// List episodes for an anime
router.get('/:animeId/episodes', listEpisodes);

// Create episode
router.post('/:animeId/episodes',
  authMiddleware,
  adminMiddleware,
  uploadAnime,
  processUploadedFiles,
  [
    body('title').isLength({ min: 1 }),
    body('number').isInt({ min: 1 }),
    body('type').isIn(['video', 'novel'])
  ],
  createEpisode
);

// Update episode
router.put('/episodes/:id',
  authMiddleware,
  adminMiddleware,
  uploadAnime,
  processUploadedFiles,
  updateEpisode
);

// Delete episode
router.delete('/episodes/:id', authMiddleware, adminMiddleware, deleteEpisode);

module.exports = router;



