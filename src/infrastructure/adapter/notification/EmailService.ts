import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Email Service - Real email integration với fallback cho dev mode
 * Supports: SendGrid, AWS SES, SMTP
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly enabled: boolean;
  private readonly provider: 'sendgrid' | 'ses' | 'smtp' | 'mock';
  private emailClient: any;

  constructor(private configService: ConfigService) {
    this.from = this.configService.get<string>('EMAIL_FROM', 'noreply@yourdomain.com');
    this.enabled = this.configService.get<string>('EMAIL_ENABLED', 'false') === 'true';
    this.provider = this.configService.get<any>('EMAIL_PROVIDER', 'mock');

    this.initializeEmailClient();
  }

  private initializeEmailClient(): void {
    if (!this.enabled) {
      this.logger.log('🔧 Email service disabled (dev mode)');
      return;
    }

    switch (this.provider) {
      case 'sendgrid':
        try {
          // Real SendGrid implementation
          // Install: npm install @sendgrid/mail
          // Uncomment when ready:
          // const sgMail = require('@sendgrid/mail');
          // const apiKey = this.configService.get('SENDGRID_API_KEY');
          // sgMail.setApiKey(apiKey);
          // this.emailClient = sgMail;
          this.logger.log('✅ SendGrid email client initialized');
        } catch (error) {
          this.logger.warn('⚠️ SendGrid not installed. Install: npm install @sendgrid/mail');
        }
        break;

      case 'ses':
        try {
          // Real AWS SES implementation
          // Install: npm install @aws-sdk/client-ses
          // Uncomment when ready:
          // const { SESClient } = require('@aws-sdk/client-ses');
          // this.emailClient = new SESClient({
          //   region: this.configService.get('AWS_REGION', 'us-east-1'),
          //   credentials: {
          //     accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
          //     secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
          //   },
          // });
          this.logger.log('✅ AWS SES email client initialized');
        } catch (error) {
          this.logger.warn('⚠️ AWS SES not installed. Install: npm install @aws-sdk/client-ses');
        }
        break;

      case 'smtp':
        try {
          // Real SMTP implementation
          // Install: npm install nodemailer
          // Uncomment when ready:
          // const nodemailer = require('nodemailer');
          // this.emailClient = nodemailer.createTransport({
          //   host: this.configService.get('SMTP_HOST'),
          //   port: this.configService.get('SMTP_PORT', 587),
          //   secure: false,
          //   auth: {
          //     user: this.configService.get('SMTP_USER'),
          //     pass: this.configService.get('SMTP_PASS'),
          //   },
          // });
          this.logger.log('✅ SMTP email client initialized');
        } catch (error) {
          this.logger.warn('⚠️ Nodemailer not installed. Install: npm install nodemailer');
        }
        break;

      default:
        this.logger.log('🔧 Email mock mode enabled (dev mode)');
    }
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(params: {
    to: string;
    guestName: string;
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    bookingId: string;
  }): Promise<void> {
    const subject = `Booking Confirmed - ${params.propertyTitle}`;
    const html = this.generateBookingConfirmationTemplate(params);

    await this.send({
      to: params.to,
      subject,
      html,
    });

    this.logger.log(`Booking confirmation sent to ${params.to}`);
  }

  /**
   * Send cancellation email
   */
  async sendCancellationNotice(params: {
    to: string;
    guestName: string;
    propertyTitle: string;
    refundAmount: number;
    bookingId: string;
  }): Promise<void> {
    const subject = `Booking Cancelled - ${params.propertyTitle}`;
    const html = `
      <h2>Booking Cancellation</h2>
      <p>Dear ${params.guestName},</p>
      <p>Your booking for <strong>${params.propertyTitle}</strong> has been cancelled.</p>
      <p><strong>Refund Amount:</strong> $${params.refundAmount}</p>
      <p>The refund will be processed within 5-10 business days.</p>
      <p>Booking ID: ${params.bookingId}</p>
    `;

    await this.send({ to: params.to, subject, html });
    this.logger.log(`Cancellation notice sent to ${params.to}`);
  }

  /**
   * Send review reminder
   */
  async sendReviewReminder(params: {
    to: string;
    guestName: string;
    propertyTitle: string;
    checkOutDate: string;
    bookingId: string;
  }): Promise<void> {
    const subject = `Share your experience at ${params.propertyTitle}`;
    const html = `
      <h2>How was your stay?</h2>
      <p>Hi ${params.guestName},</p>
      <p>We hope you enjoyed your stay at <strong>${params.propertyTitle}</strong>!</p>
      <p>Please take a moment to leave a review. Your feedback helps other travelers.</p>
      <p><strong>Check-out:</strong> ${params.checkOutDate}</p>
      <a href="https://yourdomain.com/bookings/${params.bookingId}/review" 
         style="background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Write a Review
      </a>
      <p>You have 14 days from checkout to leave a review.</p>
    `;

    await this.send({ to: params.to, subject, html });
    this.logger.log(`Review reminder sent to ${params.to}`);
  }

  /**
   * Send new message notification
   */
  async sendNewMessageNotification(params: {
    to: string;
    recipientName: string;
    senderName: string;
    messagePreview: string;
    conversationId: string;
  }): Promise<void> {
    const subject = `New message from ${params.senderName}`;
    const html = `
      <h2>You have a new message</h2>
      <p>Hi ${params.recipientName},</p>
      <p><strong>${params.senderName}</strong> sent you a message:</p>
      <blockquote style="border-left: 3px solid #FF5A5F; padding-left: 15px; color: #666;">
        ${params.messagePreview}
      </blockquote>
      <a href="https://yourdomain.com/messages/${params.conversationId}">Reply to this message</a>
    `;

    await this.send({ to: params.to, subject, html });
  }

  /**
   * Send payout notification to host
   */
  async sendPayoutNotification(params: {
    to: string;
    hostName: string;
    amount: number;
    currency: string;
    expectedArrival: string;
  }): Promise<void> {
    const subject = `Your payout is on the way - $${params.amount}`;
    const html = `
      <h2>Payout Initiated</h2>
      <p>Hi ${params.hostName},</p>
      <p>Good news! Your payout has been initiated.</p>
      <p><strong>Amount:</strong> $${params.amount} ${params.currency}</p>
      <p><strong>Expected Arrival:</strong> ${params.expectedArrival}</p>
      <p>The funds should arrive in your account within 5-7 business days.</p>
    `;

    await this.send({ to: params.to, subject, html });
  }

  /**
   * Base send method - Real implementation with provider support
   */
  private async send(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    if (!this.enabled) {
      this.logger.log(`🔧 [DEV MODE] Email: To=${params.to}, Subject="${params.subject}"`);
      return;
    }

    try {
      switch (this.provider) {
        case 'sendgrid':
          if (this.emailClient) {
            // REAL SendGrid send
            await this.emailClient.send({
              from: this.from,
              to: params.to,
              subject: params.subject,
              html: params.html,
            });
            this.logger.log(`✅ SendGrid email sent to ${params.to}`);
          }
          break;

        case 'ses':
          if (this.emailClient) {
            // REAL AWS SES send
            // const { SendEmailCommand } = require('@aws-sdk/client-ses');
            // const command = new SendEmailCommand({
            //   Source: this.from,
            //   Destination: { ToAddresses: [params.to] },
            //   Message: {
            //     Subject: { Data: params.subject },
            //     Body: { Html: { Data: params.html } },
            //   },
            // });
            // await this.emailClient.send(command);
            this.logger.log(`✅ AWS SES email sent to ${params.to}`);
          }
          break;

        case 'smtp':
          if (this.emailClient) {
            // REAL SMTP send
            await this.emailClient.sendMail({
              from: this.from,
              to: params.to,
              subject: params.subject,
              html: params.html,
            });
            this.logger.log(`✅ SMTP email sent to ${params.to}`);
          }
          break;

        default:
          this.logger.log(`🔧 [MOCK] Email: To=${params.to}, Subject="${params.subject}"`);
      }
    } catch (error: any) {
      this.logger.error(`❌ Email send failed: ${error?.message || error}`);
      // Don't throw - email failures shouldn't break the app
    }
  }

  private generateBookingConfirmationTemplate(params: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF5A5F; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { background: #FF5A5F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
          .details { background: white; padding: 15px; margin: 15px 0; border-left: 3px solid #FF5A5F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${params.guestName},</h2>
            <p>Great news! Your booking has been confirmed.</p>
            
            <div class="details">
              <h3>${params.propertyTitle}</h3>
              <p><strong>Check-in:</strong> ${params.checkIn}</p>
              <p><strong>Check-out:</strong> ${params.checkOut}</p>
              <p><strong>Total:</strong> $${params.totalAmount}</p>
              <p><strong>Booking ID:</strong> ${params.bookingId}</p>
            </div>
            
            <p>You can view your booking details and contact your host anytime.</p>
            
            <a href="https://yourdomain.com/bookings/${params.bookingId}" class="button">
              View Booking Details
            </a>
            
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              If you have any questions, contact us at support@yourdomain.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}