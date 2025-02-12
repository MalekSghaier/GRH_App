import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../schemas/user.schema'; // Importez User et UserRole

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User): Promise<User> {
    // Si le rôle n'est pas fourni, la valeur par défaut sera "visiteur" (définie dans le schéma)
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  // Méthode pour créer un superAdmin (à utiliser une seule fois)
  async createSuperAdmin(user: User): Promise<User> {
    user.role = UserRole.SUPER_ADMIN; // Forcer le rôle superAdmin
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
}
