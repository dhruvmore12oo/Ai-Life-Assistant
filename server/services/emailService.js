const { Resend } = require('resend');

class EmailService {
  async sendReminderEmail(toEmail, task, reminderType) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[EmailService] RESEND_API_KEY missing. Skipping email to:', toEmail);
      return false;
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const typeLabel = reminderType === 'day_before' 
      ? 'Upcoming Task Tomorrow' 
      : 'Task Due Today';

    const deadlineStr = task.deadline 
      ? new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'No specific date';

    // Build the email layout
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563EB; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">${typeLabel}</h2>
        </div>
        <div style="padding: 30px; background-color: #FAFAFA;">
          <p style="font-size: 16px; color: #374151;">Hello!</p>
          <p style="font-size: 16px; color: #374151;">This is an automated reminder from your AI Life Admin Assistant regarding an upcoming task.</p>
          
          <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
            <ul style="list-style: none; padding: 0; margin: 0; color: #4B5563;">
              <li style="margin-bottom: 8px;"><strong>Category:</strong> ${task.type}</li>
              <li style="margin-bottom: 8px;"><strong>Priority:</strong> ${task.priority}</li>
              <li style="margin-bottom: 0;"><strong>Deadline:</strong> <span style="color: #2563EB; font-weight: bold;">${deadlineStr}</span></li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 0;">Good luck getting this done! You can view or update this task in your dashboard.</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
          Automated message from AI Life Admin • Do not reply directly to this email.
        </div>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Assistant <onboarding@resend.dev>', // Free Resend accounts must send FROM this domain
        to: toEmail, // Must be the email registered with your Resend account for testing
        subject: `Reminder: ${typeLabel} - ${task.title}`,
        html: htmlContent
      });

      if (error) {
        console.error('[EmailService] Resend API Error:', error);
        return false;
      }

      console.log(`[EmailService] Reminder sent successfully via Resend to ${toEmail}. ID: ${data.id}`);
      return true;
    } catch (err) {
      console.error('[EmailService] Failed to send email via Resend:', err);
      return false;
    }
  }
}

module.exports = new EmailService();
