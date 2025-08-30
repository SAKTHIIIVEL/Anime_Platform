const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Episode = sequelize.define('Episode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'anime_id',
    references: { model: 'anime', key: 'id' }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  type: {
    type: DataTypes.ENUM('video', 'novel'),
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'video_url'
  },
  pdfUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'pdf_url'
  }
}, {
  tableName: 'episodes',
  timestamps: true,
  indexes: [
    { fields: ['anime_id'] },
    { fields: ['number'] }
  ]
});

module.exports = Episode;



