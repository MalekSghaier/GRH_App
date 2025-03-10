  import {Controller,Get,Post,Put,Delete,Body,Param,UseGuards,UseInterceptors,UploadedFiles,  BadRequestException,Query ,
} from '@nestjs/common';
  import { CompaniesService } from './companies.service';
  import { Company } from '../schemas/company.schema';
  import { AuthGuard } from '@nestjs/passport';
  import {SuperAdminAdminRolesGuard} from '../auth/SuperAdmin_Admin_roles.guard';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  @Controller('companies')
  @UseGuards(AuthGuard('jwt'),SuperAdminAdminRolesGuard) 
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}
  
    @Post()
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'signature', maxCount: 1 },
        ],
        {
          storage: diskStorage({
            destination: './uploads', // Dossier où les fichiers seront stockés
            filename: (req, file, callback) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
              callback(null, filename);
            },
          }),
          fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return callback(
                new BadRequestException('Seules les images sont autorisées !'),
                false,
              );
            }
            callback(null, true);
          },
        },
      ),
    )
    async create(
      @Body() company: Company,
      @UploadedFiles()
      files: { logo?: Express.Multer.File[]; signature?: Express.Multer.File[] },
    ) {
      // Ajouter les chemins des fichiers à l'objet company
      if (files.logo) {
        company.logo = files.logo[0].path;
      }
      if (files.signature) {
        company.signature = files.signature[0].path;
      }
  
      // Hacher le mot de passe avant de sauvegarder
      // Le middleware du schéma s'en chargera automatiquement grâce à `pre('save')`
      return this.companiesService.create(company);
    }
    
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 3,
    ) {
      return this.companiesService.findAll(page, limit);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Company> {
      const company = await this.companiesService.findOne(id);
      return company; // Le champ _id est automatiquement inclus
    }
  
    @Put(':id')
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'signature', maxCount: 1 },
        ],
        {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
              callback(null, filename);
            },
          }),
          fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return callback(new BadRequestException('Seules les images sont autorisées !'), false);
            }
            callback(null, true);
          },
        },
      ),
    )
    async update(
      @Param('id') id: string,
      @Body() company: Partial<Company>,
      @UploadedFiles()
      files: { logo?: Express.Multer.File[]; signature?: Express.Multer.File[] },
    ) {
      // Récupérer la compagnie actuelle
      const existingCompany = await this.companiesService.findOne(id);
    
      // Mettre à jour le logo uniquement si un fichier est fourni
      if (files.logo && files.logo[0]) {
        company.logo = files.logo[0].path;
      } else {
        company.logo = existingCompany.logo; // Conserver l'ancien logo
      }
    
      // Mettre à jour la signature uniquement si un fichier est fourni
      if (files.signature && files.signature[0]) {
        company.signature = files.signature[0].path;
      } else {
        company.signature = existingCompany.signature; // Conserver l'ancienne signature
      }
    
      // Mettre à jour le mot de passe uniquement si un nouveau mot de passe est fourni
      if (!company.password) {
        company.password = existingCompany.password; // Conserver l'ancien mot de passe
      }
    
      return this.companiesService.update(id, company);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.companiesService.delete(id);
    }
  }