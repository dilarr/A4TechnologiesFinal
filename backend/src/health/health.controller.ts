import { Controller, Get, Logger } from '@nestjs/common';
import { SmtpLoggerService } from '../logger/smtp-logger.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly smtpLoggerService: SmtpLoggerService) {}

  @Get()
  async getHealth() {
    this.logger.log('🏥 Health check requested', 'getHealth');
    
    const smtpStatus = await this.smtpLoggerService.getSmtpStatus();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      smtp: smtpStatus,
      message: smtpStatus.connection 
        ? '✅ All systems operational' 
        : '❌ SMTP connection issues detected',
    };
  }

  @Get('smtp')
  async getSmtpStatus() {
    this.logger.log('📧 SMTP status check requested', 'getSmtpStatus');
    
    const smtpStatus = await this.smtpLoggerService.getSmtpStatus();
    
    return {
      timestamp: new Date().toISOString(),
      smtp: smtpStatus,
    };
  }
}
