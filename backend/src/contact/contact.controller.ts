// src/contact/contact.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendContactMessage(@Body() createContactDto: CreateContactDto) {
    try {
      const subject = `Nouveau message de contact de ${createContactDto.name}`;
      const text = `
        Nom: ${createContactDto.name}
        Email: ${createContactDto.email}
        Message: ${createContactDto.message}
      `;

      // Envoi à votre email
      await this.emailService.sendPlainEmail({
        to: 'maleksg01@gmail.com',
        subject,
        text,
        replyTo: createContactDto.email // Permet de répondre directement à l'expéditeur
      });

      return { message: 'Votre message a été envoyé avec succès' };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de l'envoi du message");
    }
  }
}