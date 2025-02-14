import { Injectable, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      const createdUser = new this.userModel(user);
      return await createdUser.save();
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

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException(`Utilisateur avec email ${email} non trouvé`);
    return user;
  }
  
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    return user;
  }

  async findAdmins(): Promise<UserDocument[]> {
    return this.userModel.find({ role: 'admin' }).exec();
  }
  
  async updateAdmin(id: string, userData: Partial<UserDocument>): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException(`Admin avec ID ${id} non trouvé`);
    return updatedUser;
  }
  
  async deleteAdmin(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException(`Admin avec ID ${id} non trouvé`);
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
