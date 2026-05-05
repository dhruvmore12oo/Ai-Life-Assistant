const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const asyncWrapper = require('../middlewares/asyncWrapper');
const validate = require('../middlewares/validate');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

router.post('/', validate(createTaskSchema), asyncWrapper(taskController.createTask));
router.get('/', asyncWrapper(taskController.getAllTasks));
router.get('/:id', asyncWrapper(taskController.getTaskById));
router.put('/:id', validate(updateTaskSchema), asyncWrapper(taskController.updateTask));
router.delete('/:id', asyncWrapper(taskController.deleteTask));

module.exports = router;
