//users.controller.ts
import { Controller, Get, Post, Body, ConflictException, UseGuards ,NotFoundException ,Put, Delete,Param, InternalServerErrorException, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from '../schemas/user.schema'; 
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import * as bcrypt from 'bcrypt';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('my-info')
  @UseGuards(AuthGuard('jwt')) 
  async getMyInfo(@Request() req: ExpressRequest): Promise<UserDocument> {
    const userId = req.user?.id; 
  
    if (!userId) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
  
    // Vérification explicite que `userId` est bien une chaîne de caractères (string)
    if (typeof userId !== 'string') {
      throw new NotFoundException("ID d'utilisateur invalide");
    }
  
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
  
    return user;
  }  


  @Put('my-info')
  @UseGuards(AuthGuard('jwt')) // Protection avec JWT
  async updateMyProfile(@Request() req: ExpressRequest, @Body() userData: Partial<UserDocument>): Promise<UserDocument> {
    const userId = req.user?.id; // Récupération de l'ID de l'utilisateur connecté
    if (!userId) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
    return this.usersService.updateProfile(userId, userData); 
  }

  @Post('check-password')
  @UseGuards(AuthGuard('jwt'))
  async checkPassword(@Request() req: ExpressRequest, @Body('oldPassword') oldPassword: string): Promise<boolean> {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
  
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
  
    // Vérifier si l'ancien mot de passe correspond
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    return isMatch;
  }

  @Put(':id/generate-qrcode')
  @UseGuards(AuthGuard('jwt'))
  async generateQrCodeForUser(@Param('id') id: string): Promise<UserDocument> {
  return this.usersService.generateAndUpdateQrCode(id);
  }


  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Request() req: ExpressRequest, @Body('newPassword') newPassword: string): Promise<UserDocument> {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
  
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Mettre à jour le mot de passe
    const updatedUser = await this.usersService.changePassword(userId, hashedPassword);
    return updatedUser;
  }
  
  @Get()
  @UseGuards(AuthGuard('jwt')) 
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }
  @Post()
  async create(@Body() user: UserDocument): Promise<UserDocument> {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      throw new InternalServerErrorException('Une erreur interne est survenue.');
    }
  }

  @Get('admin-users')
  @UseGuards(AuthGuard('jwt'))
  async findUsersForAdmin() {
    return this.usersService.findUsersForAdmin();
  }

  @Get('admin-users/paginated')
  @UseGuards(AuthGuard('jwt'))
   async findUsersForAdminPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
     ): Promise<{ data: UserDocument[]; total: number }> {
      return this.usersService.findUsersForAdminPaginated(page, limit);
}


  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    return user;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) 
  async update(@Param('id') id: string, @Body() userData: Partial<UserDocument>): Promise<UserDocument> {
    return this.usersService.update(id, userData);
  }


  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }


  @Post('super-admin')
  async createSuperAdmin(@Body() user: UserDocument): Promise<UserDocument> {
    try {
      return await this.usersService.createSuperAdmin(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }


  
}
