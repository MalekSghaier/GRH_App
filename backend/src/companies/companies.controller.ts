  import {Controller,Get,Post,Put,Delete,Body,Param,UseGuards,UseInterceptors,UploadedFiles,  BadRequestException,} from '@nestjs/common';
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
    async findAll() {
      return this.companiesService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.companiesService.findOne(id);
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() company: Partial<Company>) {
      return this.companiesService.update(id, company);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.companiesService.delete(id);
    }
  }