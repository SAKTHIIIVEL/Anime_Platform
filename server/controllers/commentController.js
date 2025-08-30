const { Comment, User, Anime, Activity } = require('../models');

// Get comments for an anime
const getComments = async (req, res) => {
  try {
    const { id: animeId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Check if anime exists
    const anime = await Anime.findByPk(animeId);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { animeId },
      include: [
        {
          model: User,
          as: 'user',
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
        comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

// Add comment to anime
const addComment = async (req, res) => {
  try {
    const { id: animeId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment too long (max 1000 characters)'
      });
    }

    // Check if anime exists
    const anime = await Anime.findByPk(animeId);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Create comment
    const newComment = await Comment.create({
      animeId,
      userId,
      comment: comment.trim()
    });

    // Fetch comment with user info
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ]
    });

    // Log activity
    await Activity.create({
      type: 'comment_added',
      description: `Comment added to "${anime.title}" by ${req.user.username}`,
      userId: userId,
      metadata: { animeId, commentId: newComment.id }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: commentWithUser
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

module.exports = {
  getComments,
  addComment
};


