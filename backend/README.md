# A4 Technologies Backend

NestJS backend for handling contact form submissions and email notifications.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Server Configuration
PORT=3001
```

## Installation

```bash
npm install
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start
```

## API Endpoints

### POST /contact
Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your IT services."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "data": {
    "success": true,
    "message": "Emails sent successfully"
  }
}
```

### GET /health
Check application health and SMTP status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "smtp": {
    "connection": true,
    "testEmail": true,
    "config": {
      "host": "smtp.gmail.com",
      "port": "587",
      "user": "your-email@gmail.com",
      "passConfigured": true
    }
  },
  "message": "✅ All systems operational"
}
```

### GET /health/smtp
Check SMTP connection status only.

**Response:**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "smtp": {
    "connection": true,
    "testEmail": true,
    "config": {
      "host": "smtp.gmail.com",
      "port": "587",
      "user": "your-email@gmail.com",
      "passConfigured": true
    }
  }
}
```

## Features

- Contact form submission handling
- Automatic email notifications to company
- Thank you email to users
- Input validation
- CORS enabled for frontend communication
- Professional email templates
- **Comprehensive logging system with Winston**
- **SMTP connection testing and monitoring**
- **Health check endpoints**
- **Real-time SMTP status logging (TRUE/FALSE)**
- **Automatic SMTP connection test on startup**
- **Test email functionality**
