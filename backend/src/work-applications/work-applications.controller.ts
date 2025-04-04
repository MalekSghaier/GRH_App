//work-applications.controller.ts
import { Controller, Get, Post, Body,Put, Param, Delete, UseInterceptors, UploadedFiles ,BadRequestException} from '@nestjs/common';
import { WorkApplicationsService } from './work-applications.service';
import { WorkApplication } from '../schemas/work-application.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('work-applications')
export class WorkApplicationsController {
  constructor(private readonly workApplicationsService: WorkApplicationsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 }, 
        { name: 'coverLetter', maxCount: 1 }
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `application-travail-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )  
  async create(
    @Body() body: Partial<WorkApplication>,
    @UploadedFiles() files: { cv?: Express.Multer.File[], coverLetter?: Express.Multer.File[] },
  ) {

     // Validation de l'email
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!body.email || !emailRegex.test(body.email)) {
       throw new BadRequestException('Utilisez une Format d\' email valide (ex: exemple@domaine.com)');
     }

      // Vérification que birthDate existe et est valide
      if (!body.birthDate) {
       throw new BadRequestException('La date de naissance est requise');
      }

      const birthDate = new Date(body.birthDate);
      if (isNaN(birthDate.getTime())) {
        throw new BadRequestException('Date de naissance invalide');
      }

        // Calcul de l'âge
       const today = new Date();
       let age = today.getFullYear() - birthDate.getFullYear();
       const monthDiff = today.getMonth() - birthDate.getMonth();
  
       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
         age--;
       }

       if (age < 18) {
         throw new BadRequestException('Vous n\'êtes pas autorisé à postuler à cette offre d\'emploi');
       }

    if (!files.cv || !files.coverLetter) {
      throw new Error('CV et lettre de motivation requis');
    }
  
    body.cv = files.cv[0].filename;
    body.coverLetter = files.coverLetter[0].filename;
    body.status = 'En cours de traitement';

  
    return this.workApplicationsService.create(body);
  }  

  @Get()
  async findAll(): Promise<WorkApplication[]> {
    return this.workApplicationsService.findAll();
  }
  // Ajouter une nouvelle route pour les applications par entreprise
  @Get('company/:companyName')
  async findByCompany(@Param('companyName') companyName: string): Promise<WorkApplication[]> {
    return this.workApplicationsService.findByCompany(companyName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkApplication> {
    return this.workApplicationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<WorkApplication>,
  ): Promise<{ message: string; data: WorkApplication }> {
    return this.workApplicationsService.update(id, updateData);
  }
  
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string; data: WorkApplication }> {
    return this.workApplicationsService.delete(id);
  }
  
}
