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
  interviewDate: string,
  interviewTime: string,
  isInternship: boolean = false
): Promise<void> {
  try {
    const subject = isInternship 
      ? `Convocation à l'entretien pour le stage de ${position}`
      : `Convocation à l'entretien pour le poste de ${position}`;

    const text = isInternship
      ? `Bonjour ${fullName},\n\nVotre demande pour le stage ${position} est approuvée.\n\nDate de l'entretien: ${interviewDate}\nHeure: ${interviewTime} h\n\nCordialement,\nService RH`
      : `Bonjour ${fullName},\n\nVotre demande pour le poste ${position} est approuvée.\n\nDate de l'entretien: ${interviewDate}\nHeure: ${interviewTime} h\n\nCordialement,\nService RH`;

    const mailOptions = {
      from: '"Service RH" <maleksg0@gmail.com>',
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

async sendEmailWithAttachment(data: {
  to: string;
  subject: string;
  body: string;
  attachmentPath: string;
}): Promise<void> {
  try {
    const mailOptions = {
      from: '"Service RH" <maleksg0@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.body,
      attachments: [{
        filename: data.attachmentPath.split('/').pop() || 'document.pdf',
        path: data.attachmentPath
      }]
    };

    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email with attachment:', error);
    throw new Error('Echec d\'envoi d\'email avec pièce jointe');
  }
}

// Ajoutez cette méthode à votre EmailService
async sendPlainEmail(data: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  try {
    const mailOptions = {
      from: '"Flesk GRH Contact" <maleksg0@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      replyTo: data.replyTo
    };

    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact email');
  }
}

async sendEmailWithAttachmentQrCode(data: {
  to: string;
  subject: string;
  body: string;
  attachments: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
    path?: string;
  }>;
}): Promise<void> {
  try {
    const mailOptions = {
      from: '"Service RH" <maleksg0@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.body,
      attachments: data.attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
        path: attachment.path
      }))
    };

    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email with attachment:', error);
    throw new Error('Echec d\'envoi d\'email avec pièce jointe');
  }
}
  
}