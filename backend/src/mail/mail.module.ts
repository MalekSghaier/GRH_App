//mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: 'maleksg0@gmail.com',
          pass: 'njqx ljxp cmac xbff',
        },
      },
      defaults: {
        from: '"Service RH" <maleksg0@gmail.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}