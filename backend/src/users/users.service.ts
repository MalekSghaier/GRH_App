//users.service.ts
import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, Error as MongooseError } from 'mongoose';
import { User, UserRole, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async create(user: UserDocument): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(user); // Assurez-vous d'utiliser le modèle userModel
      return await createdUser.save(); // Cela sauvegarde dans la collection `users`
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async createSuperAdmin(user: UserDocument): Promise<UserDocument> {
    user.role = UserRole.SUPER_ADMIN;
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  private handleError(error: unknown): never {
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      throw new ConflictException('Cet email est déjà utilisé');
    } 
    if (error instanceof MongooseError.ValidationError) {
      throw new BadRequestException(
        Object.values(error.errors).map((err) => err.message).join(', ')
      );
    }
    throw new InternalServerErrorException('Une erreur interne est survenue');
  }
}
