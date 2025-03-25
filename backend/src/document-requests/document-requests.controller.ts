import {Controller,Post,Get,Body,UseGuards,Req,Param,UnauthorizedException,BadRequestException, Put, NotFoundException} from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { EmployeeInternGuard } from '../auth/employee-intern.guard';
  import { DocumentRequestsService } from './document-requests.service';
  import { Request } from 'express';
  import { DocumentType, RequestStatus } from '../schemas/document-request.schema';


  
  // Interface pour représenter un utilisateur authentifié
  interface AuthenticatedUser {
    id: string;
    role: string; // Ajouter cette ligne

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
    constructor(private readonly documentRequestsService: DocumentRequestsService,

    ) {}
  
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
    @UseGuards(AuthGuard('jwt')) // Protéger la route avec JWT
    async getRequestById(@Param('id') id: string, @Req() req: Request) {
      const user = req.user as AuthenticatedUser | undefined;
    
      if (!user || !user.id) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
      const request = await this.documentRequestsService.findRequestById(id);
      return request; // Le champ _id est automatiquement inclus

    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
       return this.documentRequestsService.findAll();
    }

    @Put(':id/status')
    @UseGuards(AuthGuard('jwt'))
    async updateRequestStatus(@Param('id') id: string,@Body('status') status: RequestStatus) 
    {
      return this.documentRequestsService.updateRequestStatus(id, status);
    }

    @Put(':id/approve')
    @UseGuards(AuthGuard('jwt'))
    async approveRequest(@Param('id') id: string) {
      const request = await this.documentRequestsService.findRequestById(id);
      
      if (!request) {
        throw new NotFoundException('Demande non trouvée');
      }
    
      return this.documentRequestsService.updateRequestStatus(
        id, 
        RequestStatus.APPROVED
      );
    }
  }
  