import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './src/app.module';
import { SmtpLoggerService } from './src/logger/smtp-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = 3001;
  await app.listen(PORT);
  
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  
  // Test SMTP connection on startup
  const smtpLoggerService = app.get(SmtpLoggerService);
  const smtpStatus = await smtpLoggerService.testSmtpConnection();
  
  // Display startup information
  console.log('🚀 Relaxed security headers enabled (development mode)');
  console.log('📝 Minimal logging enabled (development mode)');
  console.log('🚀 Rate limiting disabled (development mode)');
  console.log('📏 Request size limits: 50mb (development mode)');
  console.log('🌐 Permissive CORS enabled (development mode)');
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`SMTP is ready: ${smtpStatus ? 'true' : 'false'}`);
}
bootstrap();
