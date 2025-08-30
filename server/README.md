# 🎬 AnimeVerse Backend

A production-ready Node.js + Express + MySQL backend for AnimeVerse, an anime video & novel platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **File Uploads**: Support for Cloudinary (cloud) and Multer (local) with file validation
- **Database**: MySQL with Sequelize ORM, automatic table creation
- **Security**: Helmet, CORS, rate limiting, input validation
- **API Endpoints**: Complete CRUD operations for anime, users, comments, and favorites
- **Admin Panel**: User management and platform statistics
- **Activity Tracking**: Comprehensive logging of user actions

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary (optional)
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting

## 📁 Project Structure

```
server/
├── config/           # Database and external service configs
├── controllers/      # Business logic and request handlers
├── middlewares/      # Custom middleware functions
├── models/          # Sequelize database models
├── routes/          # API route definitions
├── utils/           # Utility functions and helpers
├── uploads/         # Local file storage
├── app.js           # Express application setup
├── server.js        # Server entry point
└── package.json     # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment template
   cp env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**

   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE animeverse_db;
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## ⚙️ Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=animeverse_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Limits
MAX_THUMBNAIL_SIZE=5242880
MAX_VIDEO_SIZE=524288000
MAX_PDF_SIZE=52428800
```

## 🗄️ Database Schema

### Users Table

- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password` (hashed)
- `role` (user|admin)
- `avatarUrl`
- `joinDate`
- `lastActive`

### Anime Table

- `id` (PK)
- `title`
- `description`
- `type` (video|novel)
- `category`
- `thumbnailUrl`
- `videoUrl`
- `pdfUrl`
- `rating`
- `views`
- `createdBy` (FK → users.id)

### Comments Table

- `id` (PK)
- `animeId` (FK → anime.id)
- `userId` (FK → users.id)
- `comment`
- `createdAt`

### Favorites Table

- `id` (PK)
- `userId` (FK → users.id)
- `animeId` (FK → anime.id)
- `createdAt`

### Activities Table

- `id` (PK)
- `userId` (FK → users.id)
- `type`
- `description`
- `metadata`
- `createdAt`

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Anime

- `GET /api/anime/list` - Get all anime (with pagination)
- `GET /api/anime/:id` - Get anime details
- `GET /api/anime/search` - Search/filter anime
- `POST /api/anime/upload` - Upload anime (Admin only)
- `PUT /api/anime/:id` - Update anime (Admin only)
- `DELETE /api/anime/:id` - Delete anime (Admin only)

### Comments

- `GET /api/anime/:id/comments` - Get comments for anime
- `POST /api/anime/:id/comments` - Add comment (Auth required)

### Favorites

- `POST /api/favorites/:id` - Toggle favorite (Auth required)
- `GET /api/favorites/user` - Get user favorites (Auth required)
- `GET /api/favorites/:id/status` - Check favorite status (Auth required)

### User

- `GET /api/user/profile` - Get user profile + stats (Auth required)
- `PUT /api/user/profile` - Update user profile (Auth required)
- `GET /api/user/uploads` - Get user uploads (Auth required)

### Admin

- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/:id` - Get specific user (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/stats` - Get platform statistics (Admin only)

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 File Uploads

### Supported Formats

- **Thumbnails**: JPEG, JPG, PNG, WebP (max 5MB)
- **Videos**: MP4, WebM, MKV (max 500MB)
- **Novels**: PDF (max 50MB)

### Upload Process

1. Files are uploaded via Multer middleware
2. If Cloudinary is configured, files are uploaded to cloud
3. If not, files are stored locally in `/uploads` folder
4. File URLs are stored in the database

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Sample API Calls

#### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Anime List

```bash
curl http://localhost:5000/api/anime/list?page=1&limit=10
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use production MySQL instance
3. **File Storage**: Configure Cloudinary for production file storage
4. **SSL**: Enable HTTPS in production
5. **Monitoring**: Add logging and monitoring services
6. **PM2**: Use PM2 for process management

### PM2 Setup

```bash
npm install -g pm2
pm2 start server.js --name "animeverse-backend"
pm2 startup
pm2 save
```

## 📊 Database Seeding

The seed script creates sample data including:

- Admin user: `sssakthivel928@gmail.com` / `admin123`
- Regular user: `user@example.com` / `password123`
- Sample anime (5 entries)
- Sample comments and favorites
- Sample activities

Run seeding:

```bash
npm run seed
```

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Code Style

- Use ES6+ features
- Follow async/await pattern
- Implement proper error handling
- Use meaningful variable names
- Add JSDoc comments for complex functions

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**

   - Change PORT in `.env`
   - Kill process using the port: `lsof -ti:5000 | xargs kill`

3. **File Upload Issues**

   - Check file size limits
   - Verify file formats
   - Ensure uploads directory exists

4. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

**AnimeVerse Backend** - Built with ❤️ for anime enthusiasts
