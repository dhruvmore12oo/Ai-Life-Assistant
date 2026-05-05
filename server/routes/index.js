const express = require('express');
const router = express.Router();

const taskRoutes = require('./taskRoutes');
const uploadRoutes = require('./uploadRoutes');

// Structural routing endpoints tree aggregation
router.use('/tasks', taskRoutes);
router.use('/upload', uploadRoutes);

// Generic Infrastructure Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'AI Admin Assistant Backend API is operational and accepting streams.' });
});

module.exports = router;
