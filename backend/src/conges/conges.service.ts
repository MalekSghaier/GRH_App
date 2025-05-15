//service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IConge } from '../schemas/conge.schema';
import { UsersService } from '../users/users.service'; // Importez le service User
import { User, UserDocument} from '../schemas/user.schema';
import { SoldeCongesService } from '../solde-conges/solde-conges.service';

@Injectable()
export class CongesService {
  constructor(@InjectModel('Conge') private readonly congeModel: Model<IConge>,
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Correction ici
  private readonly userService: UsersService, // Injectez le service User
  private soldeCongesService: SoldeCongesService

) {}

  //async create(userId: string, data: Partial<IConge>): Promise<IConge> {
  //  return this.congeModel.create({ ...data, userId });
  //}

  async create(userId: string, data: Partial<IConge>): Promise<IConge> {
    // Vérification que les dates sont bien définies
    if (!data.startDate || !data.endDate) {
      throw new BadRequestException('Les dates de début et de fin sont obligatoires');
    }

    // Conversion explicite en Date et vérification
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    // Vérification que les dates sont valides
    if (isNaN(startDate.getTime()))throw new BadRequestException('Date de début invalide');
    if (isNaN(endDate.getTime())) throw new BadRequestException('Date de fin invalide');

    const dureeEnJours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Vérifier le solde
    const solde = await this.soldeCongesService.getSolde(userId);
    if (solde < dureeEnJours) {
      throw new BadRequestException(`Solde de congés insuffisant. Solde actuel: ${solde} jours, demande: ${dureeEnJours} jours`);
    }

    // Créer le congé avec le statut par défaut 'pending' si non spécifié
    const congeData = {
      ...data,
      userId,
      status: data.status || 'pending'
    };

    const conge = await this.congeModel.create(congeData);

    // Mettre à jour le solde si le congé est approuvé immédiatement
    if (congeData.status === 'approved') {
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { soldeConges: -dureeEnJours }
      });
    }

    return conge;
  }

  async update(id: string, data: Partial<IConge>): Promise<IConge> {
    const conge = await this.congeModel.findById(id);
    if (!conge) throw new NotFoundException("Congé non trouvé");

    // Si le statut change
    if (data.status && data.status !== conge.status) {
      const startDate = new Date(conge.startDate);
      const endDate = new Date(conge.endDate);
      const dureeEnJours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (data.status === 'approved') {
        // Décrémenter le solde
        await this.userModel.findByIdAndUpdate(conge.userId, {
          $inc: { soldeConges: -dureeEnJours }
        });
      } else if (conge.status === 'approved' && (data.status === 'rejected' || data.status === 'pending')) {
        // Rembourser le solde si on annule une approbation
        await this.userModel.findByIdAndUpdate(conge.userId, {
          $inc: { soldeConges: dureeEnJours }
        });
      }
    }

    const updatedConge = await this.congeModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedConge) throw new NotFoundException("Congé non trouvé après mise à jour");
    
    return updatedConge;
  }



  async findByUser(userId: string): Promise<IConge[]> {
    return this.congeModel.find({ userId }).exec();
  }

  async findAll(): Promise<IConge[]> {
    return this.congeModel.find().populate('userId', 'name email').exec(); // Inclure le nom et l'email de l'utilisateur
  }

  async findAllPending(): Promise<IConge[]> {
    return this.congeModel.find({ status: 'pending' }).populate('userId', 'name email').exec();
  }

  async countPendingConges(): Promise<number> {
     return this.congeModel.countDocuments({ status: 'pending' }).exec();
  }

 // async update(id: string, data: Partial<IConge>): Promise<IConge> {
 //   const conge = await this.congeModel.findByIdAndUpdate(id, data, { new: true });
  ////  if (!conge) throw new NotFoundException("Congé non trouvé");
 //   return conge;
 // }

  async delete(id: string): Promise<void> {
    const result = await this.congeModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Congé non trouvé");
  }


  async findByCompany(companyName: string): Promise<IConge[]> {
    // 1. Trouver tous les utilisateurs de cette compagnie
    const users = await this.userService.findByCompany(companyName);
    const userIds = users.map(user => user._id);
    
    // 2. Trouver les congés de ces utilisateurs
    return this.congeModel.find({ 
      userId: { $in: userIds } 
    }).populate('userId', 'name email role company').exec();
  }

  async findPendingByCompany(companyName: string): Promise<IConge[]> {
    const users = await this.userService.findByCompany(companyName);
    
    if (!users || users.length === 0) {
      return [];
    }
  
    const userIds = users.map(user => user._id);
    
    return this.congeModel.find({ 
      userId: { $in: userIds },
      status: 'pending'
    })
    .populate({
      path: 'userId',
      select: 'name email role company',
      match: { company: companyName } // Filtre supplémentaire
    })
    .exec()
    .then(conges => conges.filter(conge => conge.userId)); // Filtre les résultats où populate a échoué
  }

  async countPendingByCompany(companyName: string): Promise<number> {
    // 1. Trouver les utilisateurs de la compagnie
    const users = await this.userModel.find({
      company: companyName,
      role: { $in: ['employé', 'stagiaire'] }
    }).select('_id').lean();
  
    const userIds = users.map(user => user._id);
  
    // 2. Compter les congés en attente de ces utilisateurs
    return this.congeModel.countDocuments({ 
      userId: { $in: userIds },
      status: 'pending'
    }).exec();
  }

async findByCompanyPaginated(
  company: string,
  page: number = 1,
  limit: number = 5,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<{ data: IConge[]; total: number }> {
  // Trouver d'abord les utilisateurs de la compagnie
  const users = await this.userModel.find({
    company,
    role: { $in: ['employé', 'stagiaire'] }
  }).select('_id').lean();

  const userIds = users.map(user => user._id);

  // Si aucun utilisateur trouvé, retourner vide
  if (userIds.length === 0) {
    return { data: [], total: 0 };
  }

  const skip = (page - 1) * limit;

  // Créer le filtre de base
  const filter: any = { 
    userId: { $in: userIds }
  };

  // Ajouter le filtre de statut si spécifié
  if (status) {
    filter.status = status;
  }

  const [data, total] = await Promise.all([
    this.congeModel.find(filter)
      .populate({
        path: 'userId',
        select: 'name email role company'
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
      
    this.congeModel.countDocuments(filter).exec()
  ]);

  return { data, total };
}

  async getMonthlyCongesStats(companyName: string): Promise<{month: string, count: number, year: number}[]> {
    // 1. Trouver les utilisateurs de la compagnie
    const users = await this.userService.findByCompany(companyName);
    const userIds = users.map(user => user._id);
  
    // 2. Requête d'agrégation pour compter les congés par mois
    const result = await this.congeModel.aggregate<{
      month: string;
      count: number;
      year: number;
    }>([
      {
        $match: {
          userId: { $in: userIds }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$requestDate" },
            month: { $month: "$requestDate" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
              },
              in: {
                $arrayElemAt: ["$$monthsInString", "$_id.month"]
              }
            }
          },
          count: 1,
          year: "$_id.year"
        }
      }
    ]).exec();
  
    return result;
  }
}
