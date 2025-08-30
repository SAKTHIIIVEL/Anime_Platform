# Backend API Documentation

This document describes all the API endpoints that need to be implemented in the backend for the AnimeVerse application.

## Base Configuration
- **Base URL**: `http://localhost:3000/api`
- **Authentication**: Bearer token in Authorization header
- **Content-Type**: `application/json` (except for file uploads)

## Authentication Endpoints

### 1. Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user|admin"
  }
}
```

### 2. Register
- **Endpoint**: `POST /auth/register`
- **Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

## Anime Endpoints

### 1. Get Anime List
- **Endpoint**: `GET /anime/list`
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "thumbnail": "string",
      "type": "video|novel",
      "category": "Action|Adventure|Comedy|Drama|Fantasy|Horror|Romance|Sci-Fi|Slice of Life",
      "rating": "number",
      "views": "number"
    }
  ]
}
```

### 2. Get Anime by ID
- **Endpoint**: `GET /anime/:id`
- **Response**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "thumbnail": "string",
  "type": "video|novel",
  "category": "string",
  "rating": "number",
  "views": "number",
  "videoUrl": "string (if type=video)",
  "pdfUrl": "string (if type=novel)",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 3. Search Anime
- **Endpoint**: `GET /anime/search`
- **Query Parameters**:
  - `query`: Search term (optional)
  - `type`: Filter by type - "video" or "novel" (optional)
  - `category`: Filter by category (optional)
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "thumbnail": "string",
      "type": "video|novel",
      "category": "string",
      "rating": "number",
      "views": "number"
    }
  ]
}
```

### 4. Upload Anime (Admin Only)
- **Endpoint**: `POST /anime/upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Request Body** (FormData):
  - `title`: string
  - `description`: string
  - `type`: "video" or "novel"
  - `category`: string
  - `thumbnail`: File (image)
  - `contentFile`: File (video or PDF)
- **Response**:
```json
{
  "id": "string",
  "title": "string",
  "message": "Anime uploaded successfully"
}
```

### 5. Update Anime (Admin Only)
- **Endpoint**: `PUT /anime/:id`
- **Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "type": "video|novel"
}
```
- **Response**:
```json
{
  "message": "Anime updated successfully"
}
```

### 6. Delete Anime (Admin Only)
- **Endpoint**: `DELETE /anime/:id`
- **Response**:
```json
{
  "message": "Anime deleted successfully"
}
```

### 7. Get Comments for Anime
- **Endpoint**: `GET /anime/:id/comments`
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "username": "string",
      "comment": "string",
      "createdAt": "string"
    }
  ]
}
```

### 8. Add Comment to Anime
- **Endpoint**: `POST /anime/:id/comments`
- **Headers**: Requires authentication
- **Request Body**:
```json
{
  "comment": "string"
}
```
- **Response**:
```json
{
  "id": "string",
  "comment": "string",
  "userId": "string",
  "username": "string",
  "createdAt": "string"
}
```

### 9. Toggle Favorite
- **Endpoint**: `POST /anime/:id/favorite`
- **Headers**: Requires authentication
- **Response**:
```json
{
  "isFavorite": "boolean",
  "message": "Added to favorites|Removed from favorites"
}
```

## User Endpoints

### 1. Get User Favorites
- **Endpoint**: `GET /user/favorites`
- **Headers**: Requires authentication
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "thumbnail": "string",
      "type": "video|novel",
      "category": "string",
      "rating": "number",
      "views": "number"
    }
  ]
}
```

### 2. Get User Profile
- **Endpoint**: `GET /user/profile`
- **Headers**: Requires authentication
- **Response**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "avatarUrl": "string",
  "joinDate": "string",
  "stats": {
    "favorites": "number",
    "uploads": "number"
  }
}
```

### 3. Update User Profile
- **Endpoint**: `PUT /user/profile`
- **Headers**: Requires authentication
- **Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "avatarUrl": "string"
}
```
- **Response**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatarUrl": "string"
  }
}
```

## Admin Endpoints (Admin Only)

### 1. Get All Users
- **Endpoint**: `GET /admin/users`
- **Headers**: Requires admin authentication
- **Response**:
```json
{
  "data": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "user|admin",
      "joinDate": "string",
      "lastActive": "string"
    }
  ]
}
```

### 2. Get User by ID
- **Endpoint**: `GET /admin/users/:id`
- **Headers**: Requires admin authentication
- **Response**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "user|admin",
  "joinDate": "string",
  "lastActive": "string",
  "stats": {
    "favorites": "number",
    "comments": "number"
  }
}
```

### 3. Update User
- **Endpoint**: `PUT /admin/users/:id`
- **Headers**: Requires admin authentication
- **Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "role": "user|admin"
}
```
- **Response**:
```json
{
  "message": "User updated successfully"
}
```

### 4. Delete User
- **Endpoint**: `DELETE /admin/users/:id`
- **Headers**: Requires admin authentication
- **Response**:
```json
{
  "message": "User deleted successfully"
}
```

### 5. Get Admin Statistics
- **Endpoint**: `GET /admin/stats`
- **Headers**: Requires admin authentication
- **Response**:
```json
{
  "totalUsers": "number",
  "totalAnime": "number",
  "totalVideos": "number",
  "totalNovels": "number",
  "totalViews": "number",
  "recentActivity": [
    {
      "type": "user_registered|anime_uploaded|comment_added",
      "description": "string",
      "timestamp": "string"
    }
  ]
}
```

## Test Credentials

For initial testing, the backend should have these pre-seeded accounts:

### Regular User
- Email: `user@example.com`
- Password: `password123`

### Admin User
- Email: `admin@example.com`
- Password: `admin123`

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "message": "Specific validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## CORS Configuration

The backend should allow CORS from the frontend origin:
- Development: `http://localhost:5173`
- Production: Configure based on your deployment URL

## File Upload Limits

- **Thumbnail images**: Max 5MB (jpeg, jpg, png, webp)
- **Videos**: Max 500MB (mp4, webm, mkv)
- **PDFs**: Max 50MB (pdf)

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in Authorization header for protected endpoints
5. Backend validates token and processes request
6. If token is invalid/expired, backend returns 401 status
7. Frontend redirects to login page on 401 errors