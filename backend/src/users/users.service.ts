//Contient la logique métier
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema'; // Importez l'interface User

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {} // Utilisez 'User' comme nom de modèle

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
}
