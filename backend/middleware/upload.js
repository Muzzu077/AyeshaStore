const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ayesha-store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto' }
    ]
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// Middleware for single image upload
const uploadSingle = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadSingleFile = upload.single(fieldName);
    
    uploadSingleFile(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected file field.'
          });
        }
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      
      // Add image info to request
      if (req.file) {
        req.imageInfo = {
          url: req.file.path,
          public_id: req.file.filename,
          secure_url: req.file.path
        };
      }
      
      next();
    });
  };
};

// Middleware for multiple images upload
const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    const uploadMultipleFiles = upload.array(fieldName, maxCount);
    
    uploadMultipleFiles(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'One or more files are too large. Maximum size is 5MB per file.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            status: 'error',
            message: `Too many files. Maximum ${maxCount} files allowed.`
          });
        }
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      
      // Add images info to request
      if (req.files && req.files.length > 0) {
        req.imagesInfo = req.files.map(file => ({
          url: file.path,
          public_id: file.filename,
          secure_url: file.path
        }));
      }
      
      next();
    });
  };
};

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to delete multiple images from Cloudinary
const deleteImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteImage,
  deleteImages,
  cloudinary
};
