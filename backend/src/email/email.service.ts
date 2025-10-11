import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendContactEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const { name, email, subject, message } = contactData;

    console.log(`📧 Main sender: Processing contact from ${name} (${email})`);

    try {
      // Send email to company (using SMTP_USER as the company email)
      console.log(`📤 Main sender: Sending notification to company`);
      await this.mailerService.sendMail({
        to: process.env.SMTP_USER,
        subject: `New Contact Form Submission: ${subject}`,
        template: 'contact-to-company',
        context: {
          name,
          email,
          subject,
          message,
        },
      });
      console.log(`✅ Main sender: Company notification sent`);

      // Send thank you email to user
      console.log(`📤 Main sender: Sending thank you to user`);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Thank you for contacting A4 Technologies',
        template: 'thank-you',
        context: {
          name,
        },
      });
      console.log(`✅ Main sender: Thank you email sent`);

      console.log(`🎉 Main sender: All emails sent successfully for ${name}`);
      return { success: true, message: 'Emails sent successfully' };

    } catch (error) {
      console.log(`❌ Main sender: Failed to send emails for ${name}`);
      throw error;
    }
  }
}
