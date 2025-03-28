//controller.ts
import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req, UnauthorizedException, Query } from '@nestjs/common';
import { CongesService } from './conges.service';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeInternGuard } from '../auth/employee-intern.guard';
import { Request } from 'express';
import { UserPayload } from '../schemas/user-payload'; 
import { IConge } from 'src/schemas/conge.schema';

@Controller('conges')
export class CongesController {
  constructor(private readonly congesService: CongesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
  create(@Req() req: Request, @Body() data) {
     const user = req.user as UserPayload;
     if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié'); 
     return this.congesService.create(user.id, data);
  }

  @Get('my-conges')
  @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
  findByUser(@Req() req: Request) {
    const user = req.user as UserPayload; 
    if (!user || !user.id) throw new UnauthorizedException('Utilisateur non authentifié');
    return this.congesService.findByUser(user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.congesService.findAll();
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  findAllPending() {
    return this.congesService.findAllPending();
  }

  @Get('company/pending/count')
  @UseGuards(AuthGuard('jwt'))
  async countPendingCongesForCompany(@Req() req: Request & { user?: UserPayload }) {
    if (!req.user?.companyName) {
      throw new UnauthorizedException('Company name not found in token');
    }
    
    const count = await this.congesService.countPendingByCompany(req.user.companyName);
    return { count };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() data: Partial<IConge>) {
    await this.congesService.update(id, data);
    return { message: 'Congé mis à jour avec succès' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    await this.congesService.delete(id);
    return { message: 'Congé supprimé avec succès' };
  }

  @Get('company/paginated')
  @UseGuards(AuthGuard('jwt'))
  async getCompanyCongesPaginated(
    @Req() req: Request & { user?: UserPayload },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5
  ) {
    // Vérification stricte du user et companyName
    if (!req.user?.companyName) {
      throw new UnauthorizedException('Company name not found in token');
    }

    // Conversion explicite des query params
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    return this.congesService.findByCompanyPaginated(
      req.user.companyName,
      pageNumber,
      limitNumber
    );
  }

}
