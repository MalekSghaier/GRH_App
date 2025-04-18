// src/internship-applications/internship-applications.controller.ts
import { Controller, Get, Post, Body, Put, Delete, UseInterceptors, UploadedFiles, BadRequestException, Param, Query, UseGuards } from '@nestjs/common';
import { InternshipApplicationsService } from './internship-applications.service';
import { EmailService } from '../email/email.service';
import { InternshipApplication } from '../schemas/internship-application.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('internship-applications')
export class InternshipApplicationsController {
  constructor(
    private readonly internshipApplicationsService: InternshipApplicationsService,
    private readonly emailService: EmailService,
  ) {}

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
            cb(null, `application-stage-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )  
  async create(
    @Body() body: Partial<InternshipApplication>,
    @UploadedFiles() files: { cv?: Express.Multer.File[], coverLetter?: Express.Multer.File[] },
  ) {

    try{
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      throw new BadRequestException('Utilisez une format d\'email valide (ex: exemple@domaine.com)');
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
      throw new BadRequestException('Vous n\'êtes pas autorisé à postuler à ce stage');
    }

    if (!files.cv || !files.coverLetter) {
      throw new BadRequestException('CV et lettre de motivation requis');
    }

    body.cv = files.cv[0].filename;
    body.coverLetter = files.coverLetter[0].filename;
    body.status = 'En cours de traitement';

    return await this.internshipApplicationsService.create(body);

  }catch (error){
    if (error.message === 'Vous avez déjà postulé à cette offre de stage') {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
  }

  @Get()
  async findAll(): Promise<InternshipApplication[]> {
    return this.internshipApplicationsService.findAll();
  }

  @Get('check-application')
async checkExistingApplication(
  @Query('email') email: string,
  @Query('company') company: string,
  @Query('position') position: string
): Promise<{ hasApplied: boolean }> {
  const existingApplication = await this.internshipApplicationsService.findOneByEmailAndPosition(
    email,
    company,
    position
  );
  return { hasApplied: !!existingApplication };
}

  @Get('company/:companyName')
  async findByCompany(
    @Param('companyName') companyName: string,
    @Query('status') status?: string
  ): Promise<InternshipApplication[]> {
    return this.internshipApplicationsService.findByCompany(companyName, status);
  }

  @Get('count/:companyName')
  async countPendingApplications(
    @Param('companyName') companyName: string
  ): Promise<{ count: number }> {
    const count = await this.internshipApplicationsService.countByCompanyAndStatus(
      companyName,
      'En cours de traitement'
    );
    return { count };
  }

  @Get('search/:companyName')
  @UseGuards(AuthGuard('jwt'))
  async searchApplications(
    @Param('companyName') companyName: string,
    @Query('query') query: string
  ): Promise<InternshipApplication[]> {
    if (!query || query.trim() === '') {
      return this.internshipApplicationsService.findByCompany(companyName);
    }
    
    return this.internshipApplicationsService.searchApplications(query, companyName);
  }

  

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InternshipApplication> {
    return this.internshipApplicationsService.findOne(id);
  }

  @Put(':id/approve')
  async approveWithInterview(
    @Param('id') id: string,
    @Body() interviewData: { date: string; time: string },
  ): Promise<{ message: string; data: InternshipApplication }> {
    const updatedApp = await this.internshipApplicationsService.update(id, {
      status: 'Approuvé',
      interviewDate: interviewData.date,
      interviewTime: interviewData.time,
    });
  
    await this.emailService.sendInterviewEmail(
      updatedApp.data.email,
      updatedApp.data.fullName,
      updatedApp.data.position,
      interviewData.date,
      interviewData.time,
      true // Indique que c'est pour un stage
    );
  
    return {
      message: 'Demande de stage approuvée et email envoyé',
      data: updatedApp.data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<InternshipApplication>,
  ): Promise<{ message: string; data: InternshipApplication }> {
    return this.internshipApplicationsService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string; data: InternshipApplication }> {
    return this.internshipApplicationsService.delete(id);
  }
}