const { Anime, User, Comment, Favorite, Activity } = require('../models');
const { Op } = require('sequelize');

// Get all anime with pagination and filters
const getAnimeList = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: animes } = await Anime.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
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
    console.error('Get anime list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime list'
    });
  }
};

// Get anime by ID
const getAnimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const anime = await Anime.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'avatarUrl']
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Increment views
    await anime.incrementViews();

    res.json({
      success: true,
      data: {
        anime: anime.getPublicData()
      }
    });
  } catch (error) {
    console.error('Get anime by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime'
    });
  }
};

// Search anime
const searchAnime = async (req, res) => {
  try {
    const { query, type, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (query) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } }
      ];
    }
    
    if (type) whereClause.type = type;
    if (category) whereClause.category = category;

    const { count, rows: animes } = await Anime.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      order: [['views', 'DESC'], ['createdAt', 'DESC']],
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
    console.error('Search anime error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};

// Upload new anime (Admin only)
const uploadAnime = async (req, res) => {
  try {
    const { title, description, type, category } = req.body;
    const { processedFiles } = req;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !description || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, type, and category are required'
      });
    }

    // Validate type
    if (!['video', 'novel'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either video or novel'
      });
    }

    // Validate files based on type
    if (type === 'video' && !processedFiles?.video) {
      return res.status(400).json({
        success: false,
        message: 'Video file is required for video type anime'
      });
    }

    if (type === 'novel' && !processedFiles?.pdf) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required for novel type anime'
      });
    }

    // Create anime
    const animeData = {
      title,
      description,
      type,
      category,
      createdBy: userId,
      thumbnailUrl: processedFiles?.thumbnail?.url || null,
      videoUrl: type === 'video' ? processedFiles?.video?.url : null,
      pdfUrl: type === 'novel' ? processedFiles?.pdf?.url : null
    };

    const anime = await Anime.create(animeData);

    // Log activity
    await Activity.create({
      type: 'anime_uploaded',
      description: `New ${type} anime "${title}" uploaded by ${req.user.username}`,
      userId: userId,
      metadata: { animeId: anime.id, animeTitle: title }
    });

    res.status(201).json({
      success: true,
      message: 'Anime uploaded successfully',
      data: {
        anime: anime.getPublicData()
      }
    });
  } catch (error) {
    console.error('Upload anime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload anime'
    });
  }
};

// Update anime (Admin only)
const updateAnime = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, category } = req.body;
    const { processedFiles } = req;

    const anime = await Anime.findByPk(id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (processedFiles?.thumbnail) updateData.thumbnailUrl = processedFiles.thumbnail.url;
    if (processedFiles?.video) updateData.videoUrl = processedFiles.video.url;
    if (processedFiles?.pdf) updateData.pdfUrl = processedFiles.pdf.url;

    await anime.update(updateData);

    res.json({
      success: true,
      message: 'Anime updated successfully',
      data: {
        anime: anime.getPublicData()
      }
    });
  } catch (error) {
    console.error('Update anime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update anime'
    });
  }
};

// Delete anime (Admin only)
const deleteAnime = async (req, res) => {
  try {
    const { id } = req.params;

    const anime = await Anime.findByPk(id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    await anime.destroy();

    res.json({
      success: true,
      message: 'Anime deleted successfully'
    });
  } catch (error) {
    console.error('Delete anime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete anime'
    });
  }
};

module.exports = {
  getAnimeList,
  getAnimeById,
  searchAnime,
  uploadAnime,
  updateAnime,
  deleteAnime
};


