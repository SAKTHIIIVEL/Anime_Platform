const { User, Anime, Comment, Favorite, Activity } = require('../models');
const { Op } = require('sequelize');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) whereClause.role = role;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get specific user details (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Anime,
          as: 'animes',
          attributes: ['id', 'title', 'type', 'views', 'createdAt']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'comment', 'createdAt']
        },
        {
          model: Favorite,
          as: 'favorites',
          attributes: ['id', 'createdAt']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate stats
    const stats = {
      totalAnimes: user.animes.length,
      totalComments: user.comments.length,
      totalFavorites: user.favorites.length,
      totalViews: user.animes.reduce((sum, anime) => sum + anime.views, 0)
    };

    res.json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const whereClause = {
        id: { [Op.ne]: id }
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
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;

    await user.update(updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Get admin statistics
const getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.count();
    const totalAnime = await Anime.count();
    const totalVideos = await Anime.count({ where: { type: 'video' } });
    const totalNovels = await Anime.count({ where: { type: 'novel' } });
    const totalViews = await Anime.sum('views') || 0;

    // Get recent activities
    const recentActivity = await Activity.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    // Get top anime by views
    const topAnime = await Anime.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        }
      ],
      order: [['views', 'DESC']],
      limit: 10
    });

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAnime,
          totalVideos,
          totalNovels,
          totalViews,
          newUsersThisMonth
        },
        recentActivity,
        topAnime
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminStats
};


