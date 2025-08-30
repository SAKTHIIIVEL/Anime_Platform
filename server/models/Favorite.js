const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'anime_id', // Explicitly map to underscored column name
    references: {
      model: 'anime',
      key: 'id'
    }
  }
}, {
  tableName: 'favorites',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id'] // Use underscored column name for index
    },
    {
      fields: ['anime_id'] // Use underscored column name for index
    },
    {
      unique: true,
      fields: ['user_id', 'anime_id'] // Use underscored column names for index
    }
  ]
});

module.exports = Favorite;
