//users.service.ts
import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, Error as MongooseError } from 'mongoose';
import { User, UserRole } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async createSuperAdmin(user: User): Promise<User> {
    user.role = UserRole.SUPER_ADMIN;
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error: unknown) {
      this.handleError(error);
    }
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
