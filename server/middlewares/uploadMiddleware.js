const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mkv'];
  const allowedPdfTypes = ['application/pdf'];

  if (file.fieldname === 'thumbnail') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid thumbnail format. Only JPEG, JPG, PNG, and WebP are allowed.'), false);
    }
  } else if (file.fieldname === 'video') {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video format. Only MP4, WebM, and MKV are allowed.'), false);
    }
  } else if (file.fieldname === 'pdf') {
    if (allowedPdfTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid PDF format. Only PDF files are allowed.'), false);
    }
  } else if (file.fieldname === 'avatar') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid avatar format. Only JPEG, JPG, PNG, and WebP are allowed.'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 524288000, // 500MB default
  }
});

// Middleware for thumbnail upload
const uploadThumbnail = upload.single('thumbnail');

// Middleware for video upload
const uploadVideo = upload.single('video');

// Middleware for PDF upload
const uploadPdf = upload.single('pdf');

// Middleware for avatar upload
const uploadAvatar = upload.single('avatar');

// Middleware for multiple files (thumbnail + video/pdf)
const uploadAnime = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// Process uploaded files (upload to Cloudinary if configured, otherwise keep local)
const processUploadedFiles = async (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      return next();
    }

    const files = req.files || { [req.file.fieldname]: [req.file] };
    const processedFiles = {};

    for (const [fieldName, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        
        if (isCloudinaryConfigured()) {
          try {
            const result = await uploadToCloudinary(file, 'animeverse');
            processedFiles[fieldName] = {
              url: result.url,
              publicId: result.publicId,
              format: result.format,
              size: result.size
            };
            
            // Remove local file after Cloudinary upload
            fs.unlinkSync(file.path);
          } catch (cloudinaryError) {
            console.error('Cloudinary upload failed, keeping local file:', cloudinaryError);
            processedFiles[fieldName] = {
              url: `/uploads/${file.filename}`,
              localPath: file.path
            };
          }
        } else {
          // Keep local file
          processedFiles[fieldName] = {
            url: `/uploads/${file.filename}`,
            localPath: file.path
          };
        }
      }
    }

    req.processedFiles = processedFiles;
    next();
  } catch (error) {
    console.error('File processing error:', error);
    next(error);
  }
};

module.exports = {
  uploadThumbnail,
  uploadVideo,
  uploadPdf,
  uploadAvatar,
  uploadAnime,
  processUploadedFiles
};


