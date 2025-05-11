//pointage.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Pointage, PointageDocument, PointageSource } from '../schemas/pointage.schema';
import * as moment from 'moment';

@Injectable()
export class PointageService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pointage.name) private pointageModel: Model<PointageDocument>
  ) {}

  async enregistrerPointage(userId: string) {
    const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
    }
    
    const dateAuj = moment().format('YYYY-MM-DD');
    const heureActuelle = moment().format('HH:mm:ss');

    const pointageExistants = await this.pointageModel.find({ 
      userId, 
      date: dateAuj 
    }).exec();

    const pointageFace = pointageExistants.find(p => p.source === PointageSource.FACE);
    if (pointageFace) {
      throw new Error('Vous avez déjà pointé via reconnaissance faciale aujourd\'hui');
    }

    const pointageQr = pointageExistants.find(p => p.source === PointageSource.QR);

    if (!pointageQr) {
      const newPointage = new this.pointageModel({ 
        userId, 
        date: dateAuj, 
        entree: heureActuelle,
        source: PointageSource.QR
      });
      await newPointage.save();
      return { 
        message: `Entrée enregistrée à ${heureActuelle}`, 
        type: 'entree' 
      };
    }

    if (!pointageQr.sortie) {
      pointageQr.sortie = heureActuelle;
      await pointageQr.save();
      return { 
        message: `Sortie enregistrée à ${heureActuelle}`, 
        type: 'sortie' 
      };
    }

    return { 
      message: 'Pointage déjà complet pour aujourd\'hui', 
      type: 'complet' 
    };
  }

  async getPointagesUtilisateur(userId: string) {
    return this.pointageModel.find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .exec();
  }
async getPointagesByMonth(userId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString();

  return this.pointageModel.find({
    userId,
    date: {
      $gte: moment(startDate).format('YYYY-MM-DD'),
      $lte: moment(endDate).format('YYYY-MM-DD')
    }
  })
  .sort({ date: -1 })
  .exec();
}

  async enregistrerPointageFace(userId: string) {
    const dateAuj = moment().format('YYYY-MM-DD');
    const heureActuelle = moment().format('HH:mm:ss');

    const pointageExistants = await this.pointageModel.find({ 
      userId, 
      date: dateAuj 
    }).exec();

    const pointageQr = pointageExistants.find(p => p.source === PointageSource.QR);
    if (pointageQr) {
      throw new Error('Vous avez déjà pointé via QR code aujourd\'hui');
    }

    const pointageFace = pointageExistants.find(p => p.source === PointageSource.FACE);

    if (!pointageFace) {
      const newPointage = new this.pointageModel({ 
        userId, 
        date: dateAuj, 
        entree: heureActuelle,
        source: PointageSource.FACE
      });
      await newPointage.save();
      return { 
        message: `Entrée enregistrée à ${heureActuelle}`, 
        type: 'entree' 
      };
    }

    if (!pointageFace.sortie) {
      pointageFace.sortie = heureActuelle;
      await pointageFace.save();
      return { 
        message: `Sortie enregistrée à ${heureActuelle}`, 
        type: 'sortie' 
      };
    }

    return { 
      message: 'Pointage déjà complet pour aujourd\'hui', 
      type: 'complet' 
    };
  }
}