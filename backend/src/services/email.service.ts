import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Email Config:', {
  host: config.email.host,
  port: config.email.port,
  user: config.email.user,
  // Don't log the password for security
});

export class EmailService {
  // Create a transporter object using the default SMTP transport
  private static transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production'
  });

  // Read and return the email template content from the specified file
  private static async getTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    return await fs.readFile(templatePath, 'utf-8');
  }

  // Replace variables in the template with actual values
  private static replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    return Object.entries(variables).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), value),
      template
    );
  }

  // Verify the SMTP connection
  static async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  // Send a verification email to the specified recipient
  static async sendVerificationEmail(email: string, username: string, token: string): Promise<void> {
    try {
      const template = await this.getTemplate('verification');
      const verificationUrl = `${config.frontend.url}/verify-email/${token}`;

      const html = this.replaceTemplateVariables(template, {
        username,
        verificationUrl,
      });

      const mailOptions = {
        from: `"Phil Brown" <${config.email.user}>`,
        to: email,
        subject: 'Verify Your Email for Mastermind',
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send a password reset email to the specified recipient
  static async sendPasswordResetEmail(
    to: string,
    name: string,
    resetToken: string
  ): Promise<void> {
    try {
      const template = await this.getTemplate('resetPassword');
      const resetLink = `${config.frontend.url}/reset-password?token=${resetToken}`;

      const html = this.replaceTemplateVariables(template, {
        name,
        resetLink,
      });

      const mailOptions = {
        from: `"FredAbod" <${config.email.user}>`,
        to,
        subject: 'Reset Your Password',
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}