const { User, Anime, Favorite, Comment, Activity } = require('../models');

// Get user profile with stats
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with counts
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Anime,
          as: 'animes',
          attributes: ['id', 'title', 'type', 'views', 'createdAt']
        }
      ]
    });

    // Get additional stats
    const favoritesCount = await Favorite.count({ where: { userId } });
    const commentsCount = await Comment.count({ where: { userId } });
    const uploadsCount = await Anime.count({ where: { createdBy: userId } });

    const profile = user.getPublicProfile();
    profile.stats = {
      favoritesCount,
      commentsCount,
      uploadsCount,
      totalViews: user.animes.reduce((sum, anime) => sum + anime.views, 0)
    };

    res.json({
      success: true,
      data: {
        user: profile
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, avatarUrl } = req.body;
    const { processedFiles } = req;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const whereClause = {
        id: { [require('sequelize').Op.ne]: userId }
      };

      if (username) whereClause.username = username;
      if (email) whereClause.email = email;

      const existingUser = await User.findOne({ where: whereClause });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }
    }

    // Update fields
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (processedFiles?.avatar) {
      updateData.avatarUrl = processedFiles.avatar.url;
    } else if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    await user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Get user uploads
const getUserUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: animes } = await Anime.findAndCountAll({
      where: { createdBy: userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        animes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch uploads'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserUploads
};
