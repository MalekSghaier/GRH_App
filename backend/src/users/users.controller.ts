import { Controller, Get, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post('super-admin')
  async createSuperAdmin(@Body() user: User): Promise<User> {
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