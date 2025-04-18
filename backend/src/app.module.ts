//app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { CompaniesModule } from './companies/companies.module'; 
import { CongesModule } from './conges/conges.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentRequestsModule } from './document-requests/document-requests.module';
import { InternshipApplicationsModule } from './internship-applications/internship-applications.module';
import { WorkApplicationsModule } from './work-applications/work-applications.module';
import { JobOffersModule } from './job-offers/job-offers.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { InternshipOffersModule } from './internship-offers/internship-offers.module';
import { ContactController } from './contact/contact.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env', // Spécifiez explicitement le chemin
    }),  
    MongooseModule.forRoot('mongodb://localhost:27017/GRH'),
    UsersModule,
    AuthModule,
    AdminsModule, 
    CompaniesModule, 
    CongesModule,
    DocumentsModule, 
    DocumentRequestsModule,
    InternshipApplicationsModule,
    WorkApplicationsModule,
    JobOffersModule,
    EmailModule,
    InternshipOffersModule,


  ],
  controllers: [AppController, ContactController],
  providers: [AppService, EmailService],
})
export class AppModule {}
