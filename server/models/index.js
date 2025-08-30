const User = require('./User');
const Anime = require('./Anime');
const Comment = require('./Comment');
const Favorite = require('./Favorite');
const Activity = require('./Activity');
const Episode = require('./Episode');

// User associations
User.hasMany(Anime, { foreignKey: 'createdBy', as: 'animes' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });

// Anime associations
Anime.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Anime.hasMany(Comment, { foreignKey: 'animeId', as: 'comments' });
Anime.hasMany(Favorite, { foreignKey: 'animeId', as: 'favorites' });
Anime.hasMany(Episode, { foreignKey: 'animeId', as: 'episodes' });

// Episode associations
Episode.belongsTo(Anime, { foreignKey: 'animeId', as: 'anime' });

// Comment associations
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Anime, { foreignKey: 'animeId', as: 'anime' });

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Anime, { foreignKey: 'animeId', as: 'anime' });

// Activity associations
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Anime,
  Comment,
  Favorite,
  Activity,
  Episode
};
