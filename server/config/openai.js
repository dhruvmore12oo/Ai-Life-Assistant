require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'stub-key' // Prevent crashing locally on boot
});

module.exports = openai;
