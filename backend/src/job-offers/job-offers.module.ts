import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { JobOffer, JobOfferSchema } from '../schemas/job-offer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobOffer.name, schema: JobOfferSchema }
    ])
  ],
  controllers: [JobOffersController],
  providers: [JobOffersService]
})
export class JobOffersModule {}