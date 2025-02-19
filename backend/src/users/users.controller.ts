//users.controller.ts
import { Controller, Get, Post, Body, ConflictException, UseGuards ,Req,NotFoundException ,Put, Delete,Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from '../schemas/user.schema'; // ✅ Utilisation de UserDocument
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard'; // Import du guard admin
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(AuthGuard('jwt')) // ✅ Protection avec JWT
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }
  @Post()
  async create(@Body() user: UserDocument): Promise<UserDocument> {
    try {
      return await this.usersService.create(user);
    } catch (error) {
    if (error instanceof ConflictException) {
      throw new ConflictException(error.message);
    }
    throw error;
    }
}

  @Get('admin-users')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async findUsersForAdmin() {
    return this.usersService.findUsersForAdmin();
  }


  @Get(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async findById(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    return user;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard) // Protection Admin
  async update(@Param('id') id: string, @Body() userData: Partial<UserDocument>): Promise<UserDocument> {
    return this.usersService.update(id, userData);
  }


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard) // Protection Admin
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


    // Ajout d'une route protégée pour récupérer les infos de l'utilisateur connecté
  @Get('profile')
  //@UseGuards(AuthGuard('jwt')) // Protection JWT
  getProfile(@Req() req: Request) {
    return req.user; // Retourne l'utilisateur authentifié
  }
}

