## AnimeVerse Backend API Documentation

Base URL: `http://localhost:5000`

- Authentication: Bearer token in `Authorization: Bearer <token>` where required
- Content-Type: JSON unless uploading files (then use multipart/form-data)
- Pagination query params: `page` (default 1), `limit` (default 10)

### Standard Error Response

```json
{
  "message": "Error summary",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

### Auth

#### POST /auth/register

- Auth: Public
- Body:

```json
{ "username": "john", "email": "john@example.com", "password": "secret123" }
```

- 201 Response:

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc1NjI3ODkwMywiZXhwIjoxNzU3MTQyOTAzfQ.2DN0dUQveiDaZumud7lquDI9b8My95U8hIIg7kjcLpA",
        "user": {
            "joinDate": "2025-08-27T07:15:03.025Z",
            "lastActive": "2025-08-27T07:15:03.025Z",
            "id": 4,
            "username": "john",
            "email": "john@example.com",
            "role": "user",
            "updatedAt": "2025-08-27T07:15:03.027Z",
            "createdAt": "2025-08-27T07:15:03.027Z"
        }
    }
}
```

#### POST /auth/login

- Auth: Public
- Body:

```json
{ "email": "user@example.com", "password": "password123" }
```

- 200 Response: 
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NjI3ODM4MCwiZXhwIjoxNzU3MTQyMzgwfQ.gac4GjHF_q4TCp2Ld3FGCQk026SPt7MiIYpMUvRD_8M",
        "user": {
            "id": 1,
            "username": "admin",
            "email": "sssakthivel928@gmail.com",
            "role": "admin",
            "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A",
            "joinDate": "2025-08-27T06:34:27.000Z",
            "lastActive": "2025-08-27T07:06:20.909Z",
            "createdAt": "2025-08-27T06:34:27.000Z",
            "updatedAt": "2025-08-27T07:06:20.910Z"
        }
    }
}

#### GET /auth/profile

- Auth: Bearer
- 200 Response:

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 4,
            "username": "john",
            "email": "john@example.com",
            "role": "user",
            "avatarUrl": null,
            "joinDate": "2025-08-27T07:15:03.000Z",
            "lastActive": "2025-08-27T07:23:54.009Z",
            "createdAt": "2025-08-27T07:15:03.000Z",
            "updatedAt": "2025-08-27T07:23:54.011Z"
        }
    }
}
```

### Anime

#### GET /anime/list

- Auth: Public
- Query: `page`, `limit`, `type` (video|novel), `category`
- 200 Response:

```json
{
    "success": true,
    "data": {
        "animes": [
            {
                "id": 1,
                "title": "Attack on Titan",
                "description": "Humanity's last stand against giant humanoid creatures known as Titans.",
                "type": "video",
                "category": "Action",
                "thumbnailUrl": "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=AOT",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 2,
                "title": "One Piece",
                "description": "A legendary pirate adventure across the Grand Line in search of the ultimate treasure.",
                "type": "video",
                "category": "Adventure",
                "thumbnailUrl": "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=OP",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 3,
                "title": "Death Note",
                "description": "A high school student discovers a supernatural notebook that can kill anyone whose name is written in it.",
                "type": "novel",
                "category": "Thriller",
                "thumbnailUrl": "https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=DN",
                "videoUrl": null,
                "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 4,
                "title": "Naruto",
                "description": "A young ninja seeks to become the strongest ninja in his village.",
                "type": "video",
                "category": "Action",
                "thumbnailUrl": "https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=N",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 1,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:55:40.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 5,
                "title": "Demon Slayer",
                "description": "A young demon slayer fights to save his sister and avenge his family.",
                "type": "video",
                "category": "Fantasy",
                "thumbnailUrl": "https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=DS",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 5,
            "itemsPerPage": 10
        }
    }
}
```

#### GET /anime/:id

- Auth: Public
- Path: `id`
- Behavior: increments views counter
- 200 Response:

```json
{
    "success": true,
    "data": {
        "anime": {
            "id": 1,
            "title": "Attack on Titan",
            "description": "Humanity's last stand against giant humanoid creatures known as Titans.",
            "type": "video",
            "category": "Action",
            "thumbnailUrl": "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=AOT",
            "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            "pdfUrl": null,
            "rating": 0,
            "views": 2,
            "createdBy": 1,
            "createdAt": "2025-08-27T06:34:28.000Z",
            "updatedAt": "2025-08-27T07:29:33.488Z",
            "creator": {
                "id": 1,
                "username": "admin",
                "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
            },
            "comments": [
                {
                    "id": 2,
                    "animeId": 1,
                    "userId": 1,
                    "comment": "One of the best anime series ever created. Highly recommended!",
                    "createdAt": "2025-08-27T06:34:28.000Z",
                    "updatedAt": "2025-08-27T06:34:28.000Z",
                    "user": {
                        "id": 1,
                        "username": "admin",
                        "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                    }
                },
                {
                    "id": 1,
                    "animeId": 1,
                    "userId": 2,
                    "comment": "This anime is absolutely amazing! The story and animation are top-notch.",
                    "createdAt": "2025-08-27T06:34:28.000Z",
                    "updatedAt": "2025-08-27T06:34:28.000Z",
                    "user": {
                        "id": 2,
                        "username": "user",
                        "avatarUrl": "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=U"
                    }
                }
            ]
        }
    }
}
```

#### GET /anime/search

- Auth: Public
- Query: `q` (search text), `type`, `category`, `page`, `limit`
- 200 Response: same shape as `/anime/list`
{
    "success": true,
    "data": {
        "animes": [
            {
                "id": 1,
                "title": "Attack on Titan",
                "description": "Humanity's last stand against giant humanoid creatures known as Titans.",
                "type": "video",
                "category": "Action",
                "thumbnailUrl": "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=AOT",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 2,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T07:29:33.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 4,
                "title": "Naruto",
                "description": "A young ninja seeks to become the strongest ninja in his village.",
                "type": "video",
                "category": "Action",
                "thumbnailUrl": "https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=N",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 1,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:55:40.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 2,
                "title": "One Piece",
                "description": "A legendary pirate adventure across the Grand Line in search of the ultimate treasure.",
                "type": "video",
                "category": "Adventure",
                "thumbnailUrl": "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=OP",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            },
            {
                "id": 5,
                "title": "Demon Slayer",
                "description": "A young demon slayer fights to save his sister and avenge his family.",
                "type": "video",
                "category": "Fantasy",
                "thumbnailUrl": "https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=DS",
                "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                "pdfUrl": null,
                "rating": 0,
                "views": 0,
                "createdBy": 1,
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "creator": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 4,
            "itemsPerPage": 10
        }
    }
}

#### POST /anime/upload

- Auth: Bearer (Admin)
- Content: `multipart/form-data`
- Fields:
  - `title` (string, required)
  - `description` (string, required)
  - `type` (video|novel, required)
  - `category` (string, required)
  - `thumbnail` (file, optional; image)
  - `video` (file, optional; when type=video)
  - `pdf` (file, optional; when type=novel)
- 201 Response: created anime object
{
    "success": true,
    "message": "Anime uploaded successfully",
    "data": {
        "anime": {
            "rating": 0,
            "views": 0,
            "id": 6,
            "title": "Gachiakuta",
            "description": "In a floating city, a young boy is framed for the death of his father and exiled. He ends up in a junkyard zone, and swears to return for revenge.",
            "type": "novel",
            "category": "action",
            "createdBy": 1,
            "thumbnailUrl": "/uploads/thumbnail-1756281266779-554343634.jpg",
            "videoUrl": null,
            "pdfUrl": "/uploads/pdf-1756281266807-722183947.pdf",
            "updatedAt": "2025-08-27T07:54:31.365Z",
            "createdAt": "2025-08-27T07:54:31.365Z"
        }
    }
}

#### PUT /anime/:id

- Auth: Bearer (Admin)
- Body (JSON or multipart, both supported): any of fields `title`, `description`, `type`, `category`, `thumbnail`, `video`, `pdf`
- 200 Response: updated anime object
{
    "success": true,
    "message": "Anime updated successfully",
    "data": {
        "anime": {
            "id": 7,
            "title": "Gachiakuta Super",
            "description": "The city, where the civilized class live, and the slum, where the descendants of criminals tribespeople gather, are the two sides of society separated by high walls, and below—the Ground—a dumpsite for trash and where criminals are exiled, is feared even by the people of the slum",
            "type": "novel",
            "category": "action",
            "thumbnailUrl": "/uploads/thumbnail-1756281916189-829189286.jpg",
            "videoUrl": null,
            "pdfUrl": "/uploads/pdf-1756281916197-652078007.pdf",
            "rating": 0,
            "views": 0,
            "createdBy": 1,
            "createdAt": "2025-08-27T08:05:22.000Z",
            "updatedAt": "2025-08-27T08:05:33.218Z"
        }
    }
}

#### DELETE /anime/:id

- Auth: Bearer (Admin)
- 200 Response:

```json
{
    "success": true,
    "message": "Anime deleted successfully"
}
```

### Comments

#### GET /anime/:id/comments

- Auth: Public
- Query: `page`, `limit`
- 200 Response:

```json
{
    "success": true,
    "data": {
        "comments": [
            {
                "id": 4,
                "animeId": 3,
                "userId": 1,
                "comment": "A psychological masterpiece. The mind games are intense!",
                "createdAt": "2025-08-27T06:34:28.000Z",
                "updatedAt": "2025-08-27T06:34:28.000Z",
                "user": {
                    "id": 1,
                    "username": "admin",
                    "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 20
        }
    }
}
```

#### POST /anime/:id/comments

- Auth: Bearer
- Body:

```json
{ "comment": "Loved this episode!" }
```

- 201 Response: created comment
{
    "success": true,
    "message": "Comment added successfully",
    "data": {
        "comment": {
            "id": 5,
            "animeId": 3,
            "userId": 1,
            "comment": "Loved this episode!",
            "createdAt": "2025-08-27T08:12:30.000Z",
            "updatedAt": "2025-08-27T08:12:30.000Z",
            "user": {
                "id": 1,
                "username": "admin",
                "avatarUrl": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A"
            }
        }
    }
}

### Favorites

#### POST /anime/:id/favorite

- Auth: Bearer
- Behavior: toggle favorite (add if missing; remove if exists)
- 200 Response:

```json
{ "favorited": true }
```

#### GET /user/favorites

- Auth: Bearer
- 200 Response:

```json
{
  "items": [
    {
      "id": 1,
      "title": "...",
      "type": "video",
      "category": "Action",
      "thumbnailUrl": "..."
    }
  ],
  "total": 2
}
```

#### GET /anime/:id/favorite/status

- Auth: Bearer
- 200 Response:

```json
{ "favorited": true }
```

### User

#### GET /user/profile

- Auth: Bearer
- 200 Response:

```json
{
  "profile": {
    "id": 2,
    "username": "user",
    "email": "user@example.com",
    "role": "user",
    "avatarUrl": null,
    "joinDate": "...",
    "lastActive": "..."
  },
  "stats": { "favoritesCount": 3, "uploadsCount": 1 }
}
```

#### PUT /user/profile

- Auth: Bearer
- Body (JSON or multipart with `avatar`):

```json
{ "username": "newname", "email": "new@example.com" }
```

- 200 Response: updated profile

#### GET /user/uploads

- Auth: Bearer
- 200 Response:

```json
{ "items": [{ "id": 5, "title": "My Upload", "type": "novel" }], "total": 1 }
```

### Admin

#### GET /admin/users

- Auth: Bearer (Admin)
- Query: `page`, `limit`, `q` (search by username/email)
- 200 Response:

```json
{
  "items": [
    {
      "id": 1,
      "username": "admin",
      "email": "...",
      "role": "admin",
      "lastActive": "..."
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 2
}
```

#### GET /admin/users/:id

- Auth: Bearer (Admin)
- 200 Response:

```json
{
  "user": {
    "id": 2,
    "username": "user",
    "email": "user@example.com",
    "role": "user",
    "avatarUrl": null,
    "joinDate": "...",
    "lastActive": "..."
  },
  "stats": { "uploads": 2, "favorites": 3, "comments": 4 }
}
```

#### PUT /admin/users/:id

- Auth: Bearer (Admin)
- Body:

```json
{ "username": "user2", "email": "user2@example.com", "role": "admin" }
```

- 200 Response: updated user object

#### DELETE /admin/users/:id

- Auth: Bearer (Admin)
- 200 Response:

```json
{ "message": "User deleted" }
```

#### GET /admin/stats

- Auth: Bearer (Admin)
- 200 Response:

```json
{
  "totalUsers": 10,
  "totalAnime": 25,
  "totalVideos": 15,
  "totalNovels": 10,
  "totalViews": 12345,
  "recentActivity": [
    {
      "id": 1,
      "type": "user_registered",
      "description": "Admin user registered",
      "createdAt": "..."
    },
    {
      "id": 2,
      "type": "anime_uploaded",
      "description": "Sample anime uploaded by admin",
      "createdAt": "..."
    }
  ]
}
```

### File Upload Notes

- Thumbnails: up to 5MB (jpeg, jpg, png, webp)
- Videos: up to 500MB (mp4, webm, mkv)
- Novels: up to 50MB (pdf)
- If Cloudinary is configured, files are uploaded remotely. Otherwise, saved under `/uploads` and served at `/uploads/<filename>`.

### Headers Cheatsheet

- Authenticated requests:

```
Authorization: Bearer <token>
Content-Type: application/json
```

- Multipart upload requests:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Health Check

#### GET /health

- Auth: Public
- 200 Response:

```json
{ "status": "ok" }
```
