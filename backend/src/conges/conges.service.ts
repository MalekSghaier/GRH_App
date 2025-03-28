//service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IConge } from '../schemas/conge.schema';
import { UsersService } from '../users/users.service'; // Importez le service User
import { User, UserDocument} from '../schemas/user.schema';




@Injectable()
export class CongesService {
  constructor(@InjectModel('Conge') private readonly congeModel: Model<IConge>,
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Correction ici
  private readonly userService: UsersService // Injectez le service User
) {}

  async create(userId: string, data: Partial<IConge>): Promise<IConge> {
    return this.congeModel.create({ ...data, userId });
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

  async update(id: string, data: Partial<IConge>): Promise<IConge> {
    const conge = await this.congeModel.findByIdAndUpdate(id, data, { new: true });
    if (!conge) throw new NotFoundException("Congé non trouvé");
    return conge;
  }

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
    limit: number = 5
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
  
    const [data, total] = await Promise.all([
      this.congeModel.find({ 
        userId: { $in: userIds },
        status: 'pending' // Ajout du filtre pour les congés en attente
      })
      .populate({
        path: 'userId',
        select: 'name email role company'
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
      
      this.congeModel.countDocuments({ 
        userId: { $in: userIds },
        status: 'pending' // Même filtre pour le count
      }).exec()
    ]);
  
    return { data, total };
  }
}
