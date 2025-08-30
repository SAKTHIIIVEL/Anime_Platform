const { Episode, Anime, Activity } = require('../models');

// List episodes for an anime
const listEpisodes = async (req, res) => {
  try {
    const { animeId } = req.params;
    const episodes = await Episode.findAll({
      where: { animeId },
      order: [['number', 'ASC'], ['createdAt', 'ASC']]
    });
    res.json({ success: true, data: { episodes } });
  } catch (error) {
    console.error('List episodes error:', error);
    res.status(500).json({ success: false, message: 'Failed to list episodes' });
  }
};

// Create episode (admin)
const createEpisode = async (req, res) => {
  try {
    const { animeId } = req.params;
    const { title, number, type } = req.body;
    const { processedFiles } = req;

    const anime = await Anime.findByPk(animeId);
    if (!anime) return res.status(404).json({ success: false, message: 'Anime not found' });

    if (!title || !number || !type) {
      return res.status(400).json({ success: false, message: 'title, number, and type are required' });
    }

    if (type === 'video' && !processedFiles?.video) {
      return res.status(400).json({ success: false, message: 'Video file required for video episode' });
    }
    if (type === 'novel' && !processedFiles?.pdf) {
      return res.status(400).json({ success: false, message: 'PDF file required for novel episode' });
    }

    const ep = await Episode.create({
      animeId: anime.id,
      title,
      number,
      type,
      videoUrl: type === 'video' ? processedFiles?.video?.url : null,
      pdfUrl: type === 'novel' ? processedFiles?.pdf?.url : null,
    });

    await Activity.create({
      type: 'anime_uploaded',
      description: `Episode ${number} added to ${anime.title}`,
      userId: req.user.id,
      metadata: { animeId: anime.id, episodeId: ep.id }
    });

    res.status(201).json({ success: true, data: { episode: ep } });
  } catch (error) {
    console.error('Create episode error:', error);
    res.status(500).json({ success: false, message: 'Failed to create episode' });
  }
};

// Update episode (admin)
const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, number, type } = req.body;
    const { processedFiles } = req;

    const ep = await Episode.findByPk(id);
    if (!ep) return res.status(404).json({ success: false, message: 'Episode not found' });

    const update = {};
    if (title) update.title = title;
    if (number) update.number = number;
    if (type) update.type = type;
    if (processedFiles?.video) update.videoUrl = processedFiles.video.url;
    if (processedFiles?.pdf) update.pdfUrl = processedFiles.pdf.url;

    await ep.update(update);
    res.json({ success: true, data: { episode: ep } });
  } catch (error) {
    console.error('Update episode error:', error);
    res.status(500).json({ success: false, message: 'Failed to update episode' });
  }
};

// Delete episode (admin)
const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const ep = await Episode.findByPk(id);
    if (!ep) return res.status(404).json({ success: false, message: 'Episode not found' });
    await ep.destroy();
    res.json({ success: true, message: 'Episode deleted' });
  } catch (error) {
    console.error('Delete episode error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete episode' });
  }
};

module.exports = { listEpisodes, createEpisode, updateEpisode, deleteEpisode };



