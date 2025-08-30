require('dotenv').config();
const { sequelize } = require('../config/db');
const { User, Anime, Comment, Favorite, Activity } = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database with force: true to recreate tables
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'sssakthivel928@gmail.com',
      password: 'admin123',
      role: 'admin',
      avatarUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A'
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      avatarUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=U'
    });
    console.log('✅ Regular user created:', regularUser.email);

    // Create sample anime
    const sampleAnime = [
      {
        title: 'Attack on Titan',
        description: 'Humanity\'s last stand against giant humanoid creatures known as Titans.',
        type: 'video',
        category: 'Action',
        thumbnailUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=AOT',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        createdBy: adminUser.id
      },
      {
        title: 'One Piece',
        description: 'A legendary pirate adventure across the Grand Line in search of the ultimate treasure.',
        type: 'video',
        category: 'Adventure',
        thumbnailUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=OP',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        createdBy: adminUser.id
      },
      {
        title: 'Death Note',
        description: 'A high school student discovers a supernatural notebook that can kill anyone whose name is written in it.',
        type: 'novel',
        category: 'Thriller',
        thumbnailUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=DN',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        createdBy: adminUser.id
      },
      {
        title: 'Naruto',
        description: 'A young ninja seeks to become the strongest ninja in his village.',
        type: 'video',
        category: 'Action',
        thumbnailUrl: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=N',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        createdBy: adminUser.id
      },
      {
        title: 'Demon Slayer',
        description: 'A young demon slayer fights to save his sister and avenge his family.',
        type: 'video',
        category: 'Fantasy',
        thumbnailUrl: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=DS',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        createdBy: adminUser.id
      }
    ];

    const createdAnime = await Anime.bulkCreate(sampleAnime);
    console.log('✅ Sample anime created:', createdAnime.length);

    // Create sample comments
    const sampleComments = [
      {
        animeId: createdAnime[0].id,
        userId: regularUser.id,
        comment: 'This anime is absolutely amazing! The story and animation are top-notch.'
      },
      {
        animeId: createdAnime[0].id,
        userId: adminUser.id,
        comment: 'One of the best anime series ever created. Highly recommended!'
      },
      {
        animeId: createdAnime[1].id,
        userId: regularUser.id,
        comment: 'The world-building in One Piece is incredible. Such a long journey but worth every episode!'
      },
      {
        animeId: createdAnime[2].id,
        userId: adminUser.id,
        comment: 'A psychological masterpiece. The mind games are intense!'
      }
    ];

    await Comment.bulkCreate(sampleComments);
    console.log('✅ Sample comments created:', sampleComments.length);

    // Create sample favorites
    const sampleFavorites = [
      {
        userId: regularUser.id,
        animeId: createdAnime[0].id
      },
      {
        userId: regularUser.id,
        animeId: createdAnime[1].id
      },
      {
        userId: adminUser.id,
        animeId: createdAnime[2].id
      }
    ];

    await Favorite.bulkCreate(sampleFavorites);
    console.log('✅ Sample favorites created:', sampleFavorites.length);

    // Create sample activities
    const sampleActivities = [
      {
        type: 'user_registered',
        description: 'Admin user registered',
        userId: adminUser.id
      },
      {
        type: 'user_registered',
        description: 'Regular user registered',
        userId: regularUser.id
      },
      {
        type: 'anime_uploaded',
        description: 'Sample anime uploaded by admin',
        userId: adminUser.id,
        metadata: { animeId: createdAnime[0].id, animeTitle: 'Attack on Titan' }
      }
    ];

    await Activity.bulkCreate(sampleActivities);
    console.log('✅ Sample activities created:', sampleActivities.length);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log(`👥 Users: ${await User.count()}`);
    console.log(`🎬 Anime: ${await Anime.count()}`);
    console.log(`💬 Comments: ${await Comment.count()}`);
    console.log(`❤️ Favorites: ${await Favorite.count()}`);
    console.log(`📊 Activities: ${await Activity.count()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: sssakthivel928@gmail.com / admin123');
    console.log('User: user@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
