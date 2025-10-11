import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpLoggerService implements OnModuleInit {
  private readonly logger = new Logger(SmtpLoggerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async onModuleInit() {
    await this.testSmtpConnection();
  }

  async testSmtpConnection(): Promise<boolean> {
    try {
      // Verify SMTP configuration
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendTestEmail(): Promise<boolean> {
    try {
      const testEmail = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: 'A4 Technologies - SMTP Test Email',
        html: `<h2>SMTP Test Successful!</h2><p>Timestamp: ${new Date().toISOString()}</p>`,
      };

      await this.transporter.sendMail(testEmail);
      
      this.logger.log('Test Email: TRUE', 'sendTestEmail');
      return true;
    } catch (error) {
      this.logger.log('Test Email: FALSE', 'sendTestEmail');
      return false;
    }
  }

  async getSmtpStatus(): Promise<{
    connection: boolean;
    testEmail: boolean;
  }> {
    const connection = await this.testSmtpConnection();
    const testEmail = await this.sendTestEmail();
    
    return {
      connection,
      testEmail,
    };
  }
}
