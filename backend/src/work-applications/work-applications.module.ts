//work-applications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkApplicationsService } from './work-applications.service';
import { WorkApplicationsController } from './work-applications.controller';
import { WorkApplication, WorkApplicationSchema } from '../schemas/work-application.schema';
import { EmailModule } from '../email/email.module'; // Chemin vers votre EmailModule


@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkApplication.name, schema: WorkApplicationSchema }]),
    EmailModule
  ],
  controllers: [WorkApplicationsController],
  providers: [WorkApplicationsService],
})
export class WorkApplicationsModule {}
