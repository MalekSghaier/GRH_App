//pointage.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    throw new BadRequestException({
      message: 'Pointage déjà effectué aujourd\'hui via reconnaissance faciale',
      code: 'FACE_ALREADY_USED'
    });
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
        message: `Sortie enregistrée à ${heureActuelle} via QR code`, 
        type: 'sortie' 
      };
    }

    return { 
      message: 'Pointage déjà complet pour aujourd\'hui (via QR code)', 
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

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException({
        message: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }


    const dateAuj = moment().format('YYYY-MM-DD');
    const heureActuelle = moment().format('HH:mm:ss');

    const pointageExistants = await this.pointageModel.find({ 
      userId, 
      date: dateAuj 
    }).exec();

    const pointageQr = pointageExistants.find(p => p.source === PointageSource.QR);
    if (pointageQr) {
      throw new BadRequestException({
        message: 'Vous avez déjà pointé via QR code aujourd\'hui',
        code: 'QR_ALREADY_USED'
      });
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
        message: `Entrée enregistrée à ${heureActuelle} via reconnaissance faciale`, 
        type: 'entree' 
      };
    }

    if (!pointageFace.sortie) {
      pointageFace.sortie = heureActuelle;
      await pointageFace.save();
      return { 
        message: `Sortie enregistrée à ${heureActuelle} via reconnaissance faciale`, 
        type: 'sortie' 
      
      };
    }
    return { 
      message: 'Pointage déjà complet pour aujourd\'hui (via reconnaissance faciale)', 
      type: 'complet' 
    };
  }

async getPresenceAujourdhui() {
  const dateAuj = moment().format('YYYY-MM-DD');
  try {
    const pointages = await this.pointageModel.aggregate([
      {
        $match: {
          date: dateAuj
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          nomComplet: { 
            $ifNull: [
              '$user.name', 
              'Utilisateur inconnu'
            ] 
          },
          date: 1,
          entree: 1,
          sortie: 1,
          source: 1,
          heuresTravail: {
            $cond: {
              if: { $and: [
                { $ifNull: ['$entree', false] },
                { $ifNull: ['$sortie', false] }
              ]},
              then: {
                $divide: [
                  { 
                    $subtract: [
                      { 
                        $dateFromString: { 
                          dateString: { $concat: ['$date', 'T', '$sortie'] },
                          format: '%Y-%m-%dT%H:%M:%S'
                        } 
                      },
                      { 
                        $dateFromString: { 
                          dateString: { $concat: ['$date', 'T', '$entree'] },
                          format: '%Y-%m-%dT%H:%M:%S'
                        } 
                      }
                    ]
                  },
                  3600000 // convertir ms en heures
                ]
              },
              else: null
            }
          }
        }
      },
      {
        $sort: { entree: -1 }
      }
    ]);

    console.log('Pointages trouvés:', JSON.stringify(pointages, null, 2)); 
    return pointages;
  } catch (error) {
    console.error('Erreur dans getPresenceAujourdhui:', error);
    throw error;
  }
}

async getPointagesByDate(date: string) {
  try {
    const pointages = await this.pointageModel.aggregate([
      {
        $match: {
          date: date // Format attendu: 'YYYY-MM-DD'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          nomComplet: { 
            $ifNull: [
              '$user.name', 
              'Utilisateur inconnu'
            ] 
          },
          date: 1,
          entree: 1,
          sortie: 1,
          source: 1,
          heuresTravail: {
            $cond: {
              if: { $and: [
                { $ifNull: ['$entree', false] },
                { $ifNull: ['$sortie', false] }
              ]},
              then: {
                $divide: [
                  { 
                    $subtract: [
                      { 
                        $dateFromString: { 
                          dateString: { $concat: ['$date', 'T', '$sortie'] },
                          format: '%Y-%m-%dT%H:%M:%S'
                        } 
                      },
                      { 
                        $dateFromString: { 
                          dateString: { $concat: ['$date', 'T', '$entree'] },
                          format: '%Y-%m-%dT%H:%M:%S'
                        } 
                      }
                    ]
                  },
                  3600000
                ]
              },
              else: null
            }
          }
        }
      },
      {
        $sort: { entree: -1 }
      }
    ]);

    return pointages;
  } catch (error) {
    console.error('Erreur dans getPointagesByDate:', error);
    throw error;
  }
}

async getJoursTravailles(userId: string, year: number, month: number): Promise<{date: string, status: 'complet' | 'entree' | 'absent'}[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const pointages = await this.pointageModel.find({
    userId,
    date: {
      $gte: moment(startDate).format('YYYY-MM-DD'),
      $lte: moment(endDate).format('YYYY-MM-DD')
    }
  }).exec();

  const joursTravailles: Record<string, 'complet' | 'entree' | 'absent'> = {};

  // Initialiser tous les jours comme absents
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = moment(currentDate).format('YYYY-MM-DD');
    joursTravailles[dateStr] = 'absent';
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Marquer les jours avec pointage
  pointages.forEach(pointage => {
    const dateStr = pointage.date;
    if (pointage.entree && pointage.sortie) {
      joursTravailles[dateStr] = 'complet';
    } else if (pointage.entree) {
      joursTravailles[dateStr] = 'entree';
    }
  });

  return Object.entries(joursTravailles).map(([date, status]) => ({ date, status }));
}
}