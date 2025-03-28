  // users.service.ts
import { Injectable, ConflictException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, Error as MongooseError } from 'mongoose';
import { User, UserRole, UserDocument } from '../schemas/user.schema';
import * as QRCode from 'qrcode';
import { ObjectId } from 'mongodb'; 
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async generateQrCode(userId: string): Promise<string> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
  
    // Vérification explicite que `user._id` est bien de type ObjectId
    if (!(user._id instanceof ObjectId)) {
      throw new InternalServerErrorException('ID utilisateur invalide');
    }
  
    const userJson = {
      id: user._id.toString(), // Conversion directe
      name: user.name,
      email: user.email,
      role: user.role,
    };
  
    const jsonString: string = JSON.stringify(userJson);
  
    try {
      const qrCodeDataUrl: string = await QRCode.toDataURL(jsonString);
      return qrCodeDataUrl;
    } catch (err) {
      throw new InternalServerErrorException(`Erreur lors de la génération du QR Code: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }


  async generateAndUpdateQrCode(userId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
  
    const qrCode = await this.generateQrCode(userId);
    user.qrcode = qrCode;
    return await user.save();
  }

  async countUsersByRole(role: string): Promise<number> {
    return this.userModel.countDocuments({ role }).exec();
  }
  
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
  
      // Enregistrer l'utilisateur dans la base de données sans générer de QR Code
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

  async findByCompany(company: string): Promise<UserDocument[]> {
    return this.userModel.find({
      company,
      role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN] }
    }).exec();
  }

  async findByCompanyPaginated(
    company: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{ data: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const data = await this.userModel
      .find({
        company,
        role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN] }
      })
      .skip(skip)
      .limit(limit)
      .exec();
      
    const total = await this.userModel
      .countDocuments({
        company,
        role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN] }
      })
      .exec();
      
    return { data, total };
  }

async findUsersForAdminPaginated(page: number = 1, limit: number = 5): Promise<{ data: UserDocument[]; total: number }> {
  const skip = (page - 1) * limit;
  const data = await this.userModel
    .find({ role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN, UserRole.VISITOR] } })
    .skip(skip)
    .limit(limit)
    .exec();
  const total = await this.userModel
    .countDocuments({ role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN, UserRole.VISITOR] } })
    .exec();
  return { data, total };
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

  async checkPassword(userId: string, oldPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
  
    // Vérifier si l'ancien mot de passe correspond
    return bcrypt.compare(oldPassword, user.password);
  }


  async changePassword(userId: string, newPassword: string): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    return updatedUser;
  }


  async searchUsers(query: string): Promise<UserDocument[]> {
    const regex = new RegExp(query, 'i'); 
    return this.userModel.find({
      $and: [
        {
          role: { $in: [UserRole.EMPLOYEE, UserRole.INTERN, UserRole.VISITOR] }
        },
        {
          $or: [
            { name: { $regex: regex } },
            { email: { $regex: regex } },
            { role: { $regex: regex } }
          ]
        }
      ]
    }).exec();
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
