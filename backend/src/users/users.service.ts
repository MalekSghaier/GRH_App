  // users.service.ts
import { Injectable, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, Error as MongooseError } from 'mongoose';
import { User, UserRole, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async create(user: UserDocument): Promise<UserDocument> {
    try {
      if (!user.role) {
        user.role = UserRole.EMPLOYEE; // Par défaut, un utilisateur est un employé
      }
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
    return this.userModel.find({ role: UserRole.ADMIN }).exec();
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

  async update(id: string, userData: Partial<UserDocument>): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    return updatedUser;
  }
  
  async delete(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
  }

  async findUsersForAdmin(): Promise<UserDocument[]> {
    return this.userModel.find({
      role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN, UserRole.VISITOR] }
    }).exec();
  }

  async updateProfile(id: string, userData: Partial<Pick<UserDocument, 'name' | 'email'>>): Promise<UserDocument> {
    const allowedFields: (keyof UserDocument)[] = ['name', 'email'];
    const updateData: Partial<Pick<UserDocument, 'name' | 'email'>> = {};

    for (const key of Object.keys(userData) as Array<keyof typeof userData>) {
      if (allowedFields.includes(key)) {
        updateData[key] = userData[key]; 
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return updatedUser;
  }


  
  private handleError(error: unknown): never {
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      throw new ConflictException('Cet email est déjà utilisé');
    } 
    if (error instanceof MongooseError.ValidationError) {
      const messages = error.errors
        ? Object.values(error.errors).map((err) => err.message).join(', ')
        : 'Erreur de validation';
      throw new BadRequestException(messages);
    }
    throw new InternalServerErrorException('Une erreur interne est survenue');
  }
}
