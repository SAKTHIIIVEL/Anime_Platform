const { Favorite, Anime, User, Activity } = require('../models');

// Toggle favorite (add/remove)
const toggleFavorite = async (req, res) => {
  try {
    const { id: animeId } = req.params;
    const userId = req.user.id;

    // Check if anime exists
    const anime = await Anime.findByPk(animeId);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: { userId, animeId }
    });

    if (existingFavorite) {
      // Remove from favorites
      await existingFavorite.destroy();

      // Log activity
      await Activity.create({
        type: 'favorite_added',
        description: `Removed "${anime.title}" from favorites by ${req.user.username}`,
        userId: userId,
        metadata: { animeId, action: 'removed' }
      });

      res.json({
        success: true,
        message: 'Removed from favorites',
        data: {
          isFavorited: false
        }
      });
    } else {
      // Add to favorites
      await Favorite.create({
        userId,
        animeId
      });

      // Log activity
      await Activity.create({
        type: 'favorite_added',
        description: `Added "${anime.title}" to favorites by ${req.user.username}`,
        userId: userId,
        metadata: { animeId, action: 'added' }
      });

      res.json({
        success: true,
        message: 'Added to favorites',
        data: {
          isFavorited: true
        }
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite'
    });
  }
};

// Get user favorites
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: favorites } = await Favorite.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Anime,
          as: 'anime',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'username', 'avatarUrl']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
};

// Check if anime is favorited by user
const checkFavoriteStatus = async (req, res) => {
  try {
    const { id: animeId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      where: { userId, animeId }
    });

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {
    console.error('Check favorite status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status'
    });
  }
};

module.exports = {
  toggleFavorite,
  getUserFavorites,
  checkFavoriteStatus
};


