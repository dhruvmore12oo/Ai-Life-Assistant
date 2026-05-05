const cron = require('node-cron');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const taskRepository = require('../repository/taskRepository');
const emailService = require('./emailService');

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

// Set default timezone for the scheduler strictly to IST
dayjs.tz.setDefault('Asia/Kolkata');

class ReminderScheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('[ReminderScheduler] ⏰ IST Timezone Scheduler starting. Running every minute...');

    // Schedule task to run at the start of every minute
    cron.schedule('* * * * *', async () => {
      try {
        await this.processReminders();
      } catch (error) {
        console.error('[ReminderScheduler] Error during execution:', error);
      }
    });
  }

  async processReminders() {
    // Current time specifically in Asia/Kolkata
    const nowIST = dayjs().tz('Asia/Kolkata');
    const todayStr = nowIST.format('YYYY-MM-DD');
    const tomorrowStr = nowIST.add(1, 'day').format('YYYY-MM-DD');
    const currentHour = nowIST.hour();
    const currentMinute = nowIST.minute();

    // Fetch pending tasks from the database (fallback or supabase)
    // In a massive production app, we would query the database directly with these time filters.
    // Here we pull all pending and filter in memory to guarantee IST parsing safety.
    const pendingTasks = await taskRepository.getAllTasks({ status: 'Pending' });

    for (const task of pendingTasks) {
      if (!task.deadline) continue;

      // Parse task deadline explicitly into IST
      const deadlineIST = dayjs(task.deadline).tz('Asia/Kolkata');
      const deadlineDateStr = deadlineIST.format('YYYY-MM-DD');

      // The email to send to. If we have Auth integrated, we'd look up the user.
      // For local testing, default to the environment EMAIL_USER.
      const toEmail = process.env.EMAIL_USER; 
      if (!toEmail) continue;

      // RULE A: One Day Before Reminder
      if (deadlineDateStr === tomorrowStr && !task.reminder_sent_day_before) {
        console.log(`[ReminderScheduler] Triggering DAY-BEFORE reminder for task: ${task.id}`);
        const success = await emailService.sendReminderEmail(toEmail, task, 'day_before');
        
        if (success) {
          await taskRepository.updateTask(task.id, { reminder_sent_day_before: true });
        }
      }

      // RULE B: Same Day Reminder exactly at 8:00 AM IST
      // We check if it's today, hour is 8, and we haven't sent it yet.
      if (deadlineDateStr === todayStr && currentHour === 8 && !task.reminder_sent_same_day) {
        console.log(`[ReminderScheduler] Triggering SAME-DAY reminder for task: ${task.id}`);
        const success = await emailService.sendReminderEmail(toEmail, task, 'same_day');
        
        if (success) {
          await taskRepository.updateTask(task.id, { reminder_sent_same_day: true });
        }
      }
    }
  }
}

module.exports = new ReminderScheduler();
