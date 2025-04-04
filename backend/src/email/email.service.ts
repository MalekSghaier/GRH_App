// email.service.ts
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'maleksg0@gmail.com',
        pass: 'nefw lasy rwxu land',
      },
    });
  }

  async sendInterviewEmail(
    to: string,
    fullName: string,
    position: string,
    interviewDate: string, // Reçoit déjà le format jj/mm/aaaa
    interviewTime: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: 'maleksg0@gmail.com',
        to,
        subject: 'Confirmation de votre entretien',
        text: `Bonjour ${fullName},\n\nVotre demande pour le poste ${position} est approuvée.\n\nDate de l'entretien: ${interviewDate}\nHeure: ${interviewTime}\n\nCordialement,\nService RH`,
      };
  
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
  
}