// src/internship-offers/internship-offers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InternshipOffersController } from './internship-offers.controller';
import { InternshipOffersService } from './internship-offers.service';
import { InternshipOffer, InternshipOfferSchema } from '../schemas/internship-offer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InternshipOffer.name, schema: InternshipOfferSchema }
    ])
  ],
  controllers: [InternshipOffersController],
  providers: [InternshipOffersService],
  exports: [InternshipOffersService] // Ajoutez cette ligne si le service doit être utilisé ailleurs

})
export class InternshipOffersModule {}