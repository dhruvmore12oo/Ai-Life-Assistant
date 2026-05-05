require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Global Middlewares Base Implementation Stack
app.use(cors()); // Allow frontend mapping integrations safely
app.use(express.json()); // Bound standard Request application/json parsing capabilities
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Execute HTTP request structural logger middleware

// Structural API Routing tree
app.use('/api', routes);

// Generic centralized Error Handling Pipeline
app.use(errorHandler);

// Global Guard preventing invisible application process node crashes
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection Panic Caught]', err.message);
});

// Initialize background automated jobs
const reminderScheduler = require('./services/reminderScheduler');
reminderScheduler.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✓ Server initialized successfully mapped gracefully!`);
  console.log(`✓ Listening securely on http://localhost:${PORT}`);
  console.log(`✓ Healthcheck Probe: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
