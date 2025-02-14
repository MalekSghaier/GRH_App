//users.controller.ts
import { Controller, Get, Post, Body, ConflictException, UseGuards ,Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from '../schemas/user.schema'; // ✅ Utilisation de UserDocument
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(AuthGuard('jwt')) // ✅ Protection avec JWT
  async findAll(): Promise<UserDocument[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: UserDocument): Promise<UserDocument> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post('super-admin')
  async createSuperAdmin(@Body() user: UserDocument): Promise<UserDocument> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
    @UseGuards(AuthGuard('jwt')) // Protection JWT
    getProfile(@Req() req: Request) {
      return req.user; // Retourne l'utilisateur authentifié
    }
}

