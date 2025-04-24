import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Pointage, PointageDocument } from '../schemas/pointage.schema';
import * as moment from 'moment';

@Injectable()
export class PointageService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pointage.name) private pointageModel: Model<PointageDocument>
  ) {}

  async enregistrerPointage(userId: string) {
    const dateAuj = moment().format('YYYY-MM-DD');
    const heureActuelle = moment().format('HH:mm:ss');

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const pointage = await this.pointageModel.findOne({ userId, date: dateAuj }).exec();

    if (!pointage) {
      const newPointage = new this.pointageModel({ 
        userId, 
        date: dateAuj, 
        entree: heureActuelle 
      });
      await newPointage.save();
      return { 
        message: `Entrée enregistrée à ${heureActuelle}`, 
        type: 'entree' 
      };
    }

    if (!pointage.sortie) {
      pointage.sortie = heureActuelle;
      await pointage.save();
      return { 
        message: `Sortie enregistrée à ${heureActuelle}`, 
        type: 'sortie' 
      };
    }

    return { 
      message: 'Pointage déjà complet pour aujourd’hui', 
      type: 'sortie' 
    };
  }

  async getPointagesUtilisateur(userId: string) {
    return this.pointageModel.find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .exec();
  }
}