const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'audio/mpeg', 
    'audio/wav', 
    'audio/webm', 
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'audio/ogg'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Only Image, PDF, and Audio files are allowed.`));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: (process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
