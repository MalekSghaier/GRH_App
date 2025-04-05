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
        from: '"Service RH" <maleksg0@gmail.com>',
        to,
        subject: `Convocation à l'entretien pour le poste de ${position}`, // <-- ici tu modifies le sujet
        text: `Bonjour ${fullName},\n\nVotre demande pour le poste ${position} est approuvée.\n\nDate de l'entretien: ${interviewDate}\nHeure: ${interviewTime} h\n\nCordialement,\nService RH`,
      };
  
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
  
}