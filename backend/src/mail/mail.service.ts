//mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendApprovalEmail(email: string, fullName: string, docType: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Document approuvé : ${docType}`,
      html: `
        <p>Bonjour ${fullName},</p>
        <p>Votre demande de <strong>${docType}</strong> a été approuvée.</p>
        <p>Cordialement,<br>L'équipe RH</p>
      `,
    });
  }
}