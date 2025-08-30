const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'anime_id', // Explicitly map to underscored column name
    references: {
      model: 'anime',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', // Explicitly map to underscored column name
    references: {
      model: 'users',
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000],
      notEmpty: true
    }
  }
}, {
  tableName: 'comments',
  timestamps: true,
  indexes: [
    {
      fields: ['anime_id'] // Use underscored column name for index
    },
    {
      fields: ['user_id'] // Use underscored column name for index
    },
    {
      fields: ['created_at'] // Use underscored column name for index
    }
  ]
});

module.exports = Comment;
