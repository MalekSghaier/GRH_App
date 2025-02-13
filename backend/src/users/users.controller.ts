import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema'; // Importez User et UserRole

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  // Route spéciale pour créer un superAdmin (à utiliser une seule fois)
  @Post('super-admin')
  async createSuperAdmin(@Body() user: User): Promise<User> {
    return this.usersService.createSuperAdmin(user);
  }
}
