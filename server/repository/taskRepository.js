const supabase = require('../config/supabase');
const fs = require('fs');
const path = require('path');

// Local Offline Fallback Database Configurations
const DB_PATH = path.join(__dirname, '../data');
const JSON_FILE = path.join(DB_PATH, 'tasks.json');

// Ensure offline local database JSON directory physically exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

function getLocalData() {
  if (!fs.existsSync(JSON_FILE)) return [];
  try { 
    const rawData = fs.readFileSync(JSON_FILE, 'utf-8');
    return JSON.parse(rawData); 
  } catch { 
    return []; 
  }
}

function saveLocalData(data) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
}

class TaskRepository {
  async createTask(taskData) {
    try {
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your_')) throw new Error('Supabase offline keys detected');
      const { data, error } = await supabase.from('tasks').insert([taskData]).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[TaskRepository] Utilizing permanent "tasks.json" local storage.');
      const tasks = getLocalData();
      const newTask = { 
        status: 'Pending',
        ...taskData, 
        id: Date.now().toString(), 
        reminder_sent_day_before: false,
        reminder_sent_same_day: false,
        created_at: new Date().toISOString() 
      };
      tasks.unshift(newTask);
      saveLocalData(tasks);
      return newTask;
    }
  }

  async getAllTasks(filters = {}) {
    try {
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your_')) throw new Error('Supabase offline keys detected');
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
      
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.type) query = query.eq('type', filters.type);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      let tasks = getLocalData();
      if (filters.status) tasks = tasks.filter(t => (t.status || 'Pending') === filters.status);
      if (filters.type) tasks = tasks.filter(t => t.type === filters.type);
      return tasks;
    }
  }

  async getTaskById(id) {
    try {
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your_')) throw new Error('Supabase offline keys detected');
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      const tasks = getLocalData();
      return tasks.find(t => t.id === id) || null;
    }
  }

  async updateTask(id, updateData) {
    try {
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your_')) throw new Error('Supabase offline keys detected');
      const { data, error } = await supabase.from('tasks').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      const tasks = getLocalData();
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found locally in tasks.json');
      tasks[index] = { ...tasks[index], ...updateData };
      saveLocalData(tasks);
      return tasks[index];
    }
  }

  async deleteTask(id) {
    try {
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your_')) throw new Error('Supabase offline keys detected');
      const { data, error } = await supabase.from('tasks').delete().eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      let tasks = getLocalData();
      const taskToDelete = tasks.find(t => t.id === id);
      tasks = tasks.filter(t => t.id !== id);
      saveLocalData(tasks);
      return taskToDelete;
    }
  }
}

module.exports = new TaskRepository();
