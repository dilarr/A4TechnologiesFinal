import { Controller, Post, Get, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test')
  testEndpoint() {
    console.log('🧪 Test endpoint hit');
    return { message: 'Backend is working!', timestamp: new Date().toISOString() };
  }

  @Post()
  async sendContactForm(@Body() contactDto: ContactDto) {
    console.log('📨 Contact form received:', JSON.stringify(contactDto, null, 2));
    
    try {
      const result = await this.emailService.sendContactEmail(contactDto);
      console.log('✅ Contact form processed successfully');
      return {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        data: result,
      };
    } catch (error) {
      console.error('❌ Error sending contact email:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send message. Please try again later.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
