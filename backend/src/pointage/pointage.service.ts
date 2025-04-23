import { Injectable } from '@nestjs/common';
import { PointageModel } from 'src/schemas/pointage.schema';
import * as moment from 'moment';

@Injectable()
export class PointageService {
  async enregistrerPointage(userId: string): Promise<string> {
    const dateAuj = moment().format('YYYY-MM-DD');
    const heureActuelle = moment().format('HH:mm:ss');

    const pointage = await PointageModel.findOne({ userId, date: dateAuj });

    if (!pointage) {
      // Premier pointage de la journée
      await PointageModel.create({ userId, date: dateAuj, entree: heureActuelle });
      return 'Entrée enregistrée';
    }

    if (!pointage.sortie) {
      pointage.sortie = heureActuelle;
      await pointage.save();
      return 'Sortie enregistrée';
    }

    return 'Pointage déjà complet pour aujourd’hui';
  }
}
