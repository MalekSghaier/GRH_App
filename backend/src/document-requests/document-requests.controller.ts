import {Controller,Post,Get,Body,UseGuards,Req,Param,UnauthorizedException,BadRequestException} from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { EmployeeInternGuard } from '../auth/employee-intern.guard';
  import { DocumentRequestsService } from './document-requests.service';
  import { Request } from 'express';
  import { DocumentType } from '../schemas/document-request.schema';
  import { AdminGuard } from 'src/auth/admin.guard';
  
  // Interface pour représenter un utilisateur authentifié
  interface AuthenticatedUser {
    id: string;
  }
  
  // Interface pour les données du formulaire
  interface CreateDocumentRequestDto {
    fullName: string;
    jobPosition: string;
    contractType: 'CDI' | 'CDD' | 'Stage';
    professionalEmail: string;
    documentType: DocumentType;
  }
  
  @Controller('document-requests')
  export class DocumentRequestsController {
    constructor(private readonly documentRequestsService: DocumentRequestsService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
    async createRequest(@Body() body: CreateDocumentRequestDto, @Req() req: Request) {
      const user = req.user as AuthenticatedUser | undefined;
  
      if (!user || !user.id) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
  
      const { fullName, jobPosition, contractType, professionalEmail, documentType } = body;
  
      // Vérification des champs obligatoires
      if (!fullName || !jobPosition || !contractType || !professionalEmail || !documentType) {
        throw new BadRequestException('Tous les champs sont obligatoires');
      }
  
      // Vérification du type de contrat
      if (!['CDI', 'CDD', 'Stage'].includes(contractType)) {
        throw new BadRequestException('Type de contrat invalide');
      }
  
      // Vérification du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(professionalEmail)) {
        throw new BadRequestException('Adresse e-mail invalide');
      }
  
      // Vérification du type de document
      if (!Object.values(DocumentType).includes(documentType)) {
        throw new BadRequestException('Type de document invalide');
      }
  
      // Création de la demande
      return this.documentRequestsService.createRequest({
        fullName,
        jobPosition,
        contractType,
        professionalEmail,
        documentType,
        userId: user.id,
      });
    }
  
    @Get('mes-demandes')
    @UseGuards(AuthGuard('jwt'), EmployeeInternGuard)
    async getMyRequests(@Req() req: Request) {
      const user = req.user as AuthenticatedUser | undefined;
  
      if (!user || !user.id) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
  
      return this.documentRequestsService.findRequestsByUser(user.id);
    }
  
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async getRequestById(@Param('id') id: string, @Req() req: Request) {
      const user = req.user as AuthenticatedUser | undefined;
  
      if (!user || !user.id) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
  
      const request = await this.documentRequestsService.findRequestById(id);
      if (!request) {
        throw new BadRequestException('Demande non trouvée');
      }
  
      if (request.userId !== user.id) {
        throw new UnauthorizedException('Vous n’êtes pas autorisé à consulter cette demande');
      }
  
      return request;
    }
    @Get()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    findAll() {
       return this.documentRequestsService.findAll();
    }
  }
  