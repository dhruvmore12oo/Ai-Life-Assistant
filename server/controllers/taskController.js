const taskRepository = require('../repository/taskRepository');
const { successResponse } = require('../utils/responseFormatter');

class TaskController {
  async createTask(req, res) {
    const task = await taskRepository.createTask(req.body);
    return successResponse(res, task, 'Task created successfully', 201);
  }

  async getAllTasks(req, res) {
    const filters = {
      status: req.query.status,
      type: req.query.type
    };
    const tasks = await taskRepository.getAllTasks(filters);
    return successResponse(res, tasks, 'Tasks retrieved successfully');
  }

  async getTaskById(req, res) {
    const task = await taskRepository.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return successResponse(res, task, 'Task retrieved successfully');
  }

  async updateTask(req, res) {
    const task = await taskRepository.updateTask(req.params.id, req.body);
    return successResponse(res, task, 'Task updated successfully');
  }

  async deleteTask(req, res) {
    const task = await taskRepository.deleteTask(req.params.id);
    return successResponse(res, task, 'Task deleted successfully');
  }
}

module.exports = new TaskController();
