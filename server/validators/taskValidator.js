const Joi = require('joi');

exports.createTaskSchema = Joi.object({
  title: Joi.string().max(255).required(),
  type: Joi.string().valid('Bill', 'Assignment', 'Reminder', 'Appointment').required(),
  deadline: Joi.date().iso().allow(null).optional(),
  priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
  status: Joi.string().valid('Pending', 'Completed').default('Pending'),
  notes: Joi.string().allow('').optional(),
  ai_confidence: Joi.number().integer().min(0).max(100).optional()
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  type: Joi.string().valid('Bill', 'Assignment', 'Reminder', 'Appointment').optional(),
  deadline: Joi.date().iso().allow(null).optional(),
  priority: Joi.string().valid('High', 'Medium', 'Low').optional(),
  status: Joi.string().valid('Pending', 'Completed').optional(),
  notes: Joi.string().allow('').optional(),
  ai_confidence: Joi.number().integer().min(0).max(100).optional()
}).min(1); // At least one field must be updated
