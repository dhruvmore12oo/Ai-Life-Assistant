const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middlewares/uploadMiddleware');
const asyncWrapper = require('../middlewares/asyncWrapper');

// Intercepts multi-part data into local filesystem -> validates mimetype -> maps to processing controller
router.post('/', upload.single('file'), asyncWrapper(uploadController.processUpload));

// Receives raw text prompts securely skipping Multer
router.post('/text', asyncWrapper(uploadController.processText));

module.exports = router;
