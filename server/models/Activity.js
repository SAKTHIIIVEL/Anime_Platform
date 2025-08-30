const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id', // Explicitly map to underscored column name
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('user_registered', 'anime_uploaded', 'comment_added', 'favorite_added', 'user_login'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'activities',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['user_id'] // Use underscored column name for index
    },
    {
      fields: ['created_at'] // Use underscored column name for index
    }
  ]
});

module.exports = Activity;
