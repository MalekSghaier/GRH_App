//admins.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument, UserRole } from '../schemas/user.schema'; // Importer UserRole
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protection JWT + Vérification du rôle SuperAdmin
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createAdmin(@Body() user: UserDocument): Promise<UserDocument> {
    user.role = UserRole.ADMIN; // ✅ Utilisation correcte de l'enum
    return this.usersService.create(user);
  }

  @Get()
  async getAllAdmins(): Promise<UserDocument[]> {
    return this.usersService.findAdmins();
  }

  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body() user: Partial<UserDocument>): Promise<UserDocument> {
    return this.usersService.updateAdmin(id, user);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteAdmin(id);
    return { message: "Admin supprimé avec succès" };
  }
}
