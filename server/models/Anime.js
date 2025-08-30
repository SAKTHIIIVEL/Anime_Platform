const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Anime = sequelize.define('Anime', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('video', 'novel'),
    allowNull: false,
    validate: {
      isIn: [['video', 'novel']]
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  pdfUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    validate: {
      min: 0.0,
      max: 5.0
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by', // Explicitly map to underscored column name
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'anime',
  timestamps: true,
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['created_by'] // Use underscored column name for index
    }
  ]
});

// Instance method to increment views
Anime.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Instance method to get public data
Anime.prototype.getPublicData = function() {
  const data = this.toJSON();
  return data;
};

module.exports = Anime;
