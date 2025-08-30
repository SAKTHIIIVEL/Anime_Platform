# 🚀 Quick Setup Guide

## ⚡ Get Started in 5 Minutes

### 1. Database Setup

```sql
-- Run in MySQL
CREATE DATABASE animeverse_db;
```

### 2. Environment Configuration

```bash
# Copy and edit environment file
cp env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=animeverse_db
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

```bash
# Development mode
npm run dev

# Or use the batch file (Windows)
start.bat
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

## 🔑 Default Users (after seeding)

- **Admin**: `sssakthivel928@gmail.com` / `admin123`
- **User**: `user@example.com` / `password123`

## 🌐 Test Your Setup

Visit: `http://localhost:5000/health`

Should return: `{"success":true,"message":"AnimeVerse Backend is running"}`

## 📚 Next Steps

1. Check the full [README.md](README.md) for detailed documentation
2. Explore the API endpoints
3. Test file uploads
4. Customize for your needs

## 🆘 Need Help?

- Check the [README.md](README.md) for troubleshooting
- Ensure MySQL is running
- Verify database credentials
- Check port 5000 is available
