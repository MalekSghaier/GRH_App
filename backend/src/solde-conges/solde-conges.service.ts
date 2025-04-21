// solde-conges.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class SoldeCongesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument> // Injection corrigée

  ) {}

  //@Cron('*/10 * * * * *') // Toutes les 10 secondes pour les tests
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'Africa/Tunis',
  })
  async incrementerSoldesMensuels() {
    try {
      const result = await this.userModel.updateMany(
        { role: UserRole.EMPLOYEE },
        { $inc: { soldeConges: 2 } } // Incrémente de 2 jours seulement
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Soldes mis à jour pour ${result.modifiedCount} employés`);
      } else {
        console.log('Aucun solde à mettre à jour ce mois-ci');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des soldes:', error);
    }
  }

  async getSolde(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).select('soldeConges');
    return user?.soldeConges || 0;
  }
}