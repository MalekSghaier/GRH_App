import {Controller,Post,Get,Body,UseGuards,Req,Param,UnauthorizedException,BadRequestException, Put, NotFoundException, Query, UploadedFile, UseInterceptors, Delete} from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { EmployeeInternGuard } from '../auth/employee-intern.guard';
  import { DocumentRequestsService } from './document-requests.service';
  import { Request } from 'express';
  import { DocumentType, RequestStatus } from '../schemas/document-request.schema';
  import { UserPayload } from 'src/schemas/user-payload';
  import { EmailService } from 'src/email/email.service';
import { FileInterceptor } from '@nestjs/platform-express';

  // Interface pour représenter un utilisateur authentifié
  interface AuthenticatedUser {
    id: string;
    role: string; // Ajouter cette ligne
  }
  // Interface pour les données du formulaire
  interface CreateDocumentRequestDto {
    fullName: string;
    jobPosition: string;
    contractType: 'CDI' | 'CDD' ;
    professionalEmail: string;
    documentType: DocumentType;
  }
  
  @Controller('document-requests')
  export class DocumentRequestsController {
    constructor(
      private readonly documentRequestsService: DocumentRequestsService,
      private emailService : EmailService,

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
      if (!['CDI', 'CDD'].includes(contractType)) {
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


    @Post('approve-with-document')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('document'))
    async approveWithDocument(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: { requestId: string, message: string }
    ) {
      if (!file) {
        throw new BadRequestException('Aucun fichier fourni');
      }
    
      const request = await this.documentRequestsService.findRequestById(body.requestId);
      if (!request) {
        throw new NotFoundException('Demande non trouvée');
      }

      // Mettre à jour le statut
      const updatedRequest = await this.documentRequestsService.updateRequestStatus(
        body.requestId, 
        RequestStatus.APPROVED
      );

      // Envoyer l'email avec le document
      await this.emailService.sendEmailWithAttachment({
        to: request.professionalEmail,
        subject: `Votre document: ${request.documentType}`,
        body: body.message,
        attachmentPath: file.path
      });

      return updatedRequest;
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
    @Get('company/stats')
    @UseGuards(AuthGuard('jwt'))
    async getDocumentStats(@Req() req: Request & { user?: UserPayload }) {
     if (!req.user?.companyName) {
      throw new UnauthorizedException('Company name not found in token');
    }
  
     return this.documentRequestsService.getDocumentStatsByCompany(req.user.companyName);
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

    @Get('company/paginated')
    @UseGuards(AuthGuard('jwt'))
    async getCompanyDocumentRequestsPaginated(
      @Req() req: Request & { user?: UserPayload },
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 5
    ) {
      if (!req.user?.companyName) {
        throw new UnauthorizedException('Company name not found in token');
      }
  
      return this.documentRequestsService.findByCompanyPaginated(
        req.user.companyName,
        page,
        limit
      );
    }
    @Get('company/pending/count')
    @UseGuards(AuthGuard('jwt'))
    async countPendingDocsForCompany(@Req() req: Request & { user?: UserPayload }) {
      if (!req.user?.companyName) {
        throw new UnauthorizedException('Company name not found in token');
      }
  
      const count = await this.documentRequestsService.countPendingByCompany(req.user.companyName);
      return { count };
    }

    @Get('pending/count')
    @UseGuards(AuthGuard('jwt'))
    async countPendingDocs() {
      const count = await this.documentRequestsService.countPendingDocs();
      return { count };
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

      @Delete(':id')
      async delete(@Param('id') id: string): Promise<{ message: string }> {
        await this.documentRequestsService.delete(id);
        return { message: "Demande de document supprimée avec succès" };
      }
  }
  