//internship-applications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InternshipApplicationsService } from './internship-applications.service';
import { InternshipApplicationsController } from './internship-applications.controller';
import { InternshipApplication, InternshipApplicationSchema } from '../schemas/internship-application.schema';
import { EmailModule } from '../email/email.module'; // Chemin vers votre EmailModule


@Module({
  imports: [
    MongooseModule.forFeature([{ name: InternshipApplication.name, schema: InternshipApplicationSchema }]),
    EmailModule

  ],
  controllers: [InternshipApplicationsController],
  providers: [InternshipApplicationsService],
})
export class InternshipApplicationsModule {}