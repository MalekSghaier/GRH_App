import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CongesService } from './conges.service';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeInternGuard } from '../auth/employee-intern.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Request } from 'express';
import { UserPayload } from '../schemas/user-payload';  // 🔥 Importer le type
import { IConge } from 'src/schemas/conge.schema';

@Controller('conges')
export class CongesController {
  constructor(private readonly congesService: CongesService) {}

  // ✅ Création de congé (employé et stagiaire)
  @Post()
  @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
  create(@Req() req: Request, @Body() data) {
     const user = req.user as UserPayload; // 🔥 Cast explicite
     if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié'); // 🔥 Vérification
     return this.congesService.create(user.id, data);
  }

  // ✅ Récupérer les congés de l'utilisateur connecté (employé et stagiaire)
  @Get('my-conges')
  @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
  findByUser(@Req() req: Request) {
    const user = req.user as UserPayload; // 🔥 Cast explicite
    if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié');
    return this.congesService.findByUser(user.id);
  }

  // ✅ Récupérer tous les congés (admin uniquement)
  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  findAll() {
    return this.congesService.findAll();
  }

  // ✅ Modifier un congé (admin uniquement)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async update(@Param('id') id: string, @Body() data: Partial<IConge>) {
    await this.congesService.update(id, data);
    return { message: 'Congé mis à jour avec succès' };
  }

  // ✅ Supprimer un congé (admin uniquement)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async delete(@Param('id') id: string) {
    await this.congesService.delete(id);
    return { message: 'Congé supprimé avec succès' };
  }

}
