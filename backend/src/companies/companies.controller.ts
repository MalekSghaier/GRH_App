  import {Controller,Get,Post,Put,Delete,Body,Param,UseGuards,UseInterceptors,UploadedFiles,  BadRequestException,Query, NotFoundException ,
} from '@nestjs/common';
  import { CompaniesService } from './companies.service';
  import { Company,CompanyDocument } from '../schemas/company.schema';
  import { AuthGuard } from '@nestjs/passport';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { Request } from '@nestjs/common';
  import { Request as ExpressRequest } from 'express';
  import { UsersService } from 'src/users/users.service';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import * as bcrypt from 'bcrypt';

  @Controller('companies')
  @UseGuards(AuthGuard('jwt')) 
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService,
      private readonly usersService: UsersService, // Injecter le service UsersService

    ) {}
  
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

      return this.companiesService.create(company);
    }

    @Post('check-password')
    @UseGuards(AuthGuard('jwt'))
    async checkPassword(@Request() req: ExpressRequest, @Body('oldPassword') oldPassword: string): Promise<boolean> {
      const companyId = req.user?.id;
      if (!companyId) {
        throw new NotFoundException("Compagnie non trouvée");
      }
      return this.companiesService.checkPassword(companyId, oldPassword);
    }
    
    @Get()
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 3,
    ) {
      return this.companiesService.findAll(page, limit);
    }

    @Get('search')
    async search(@Query('query') query: string): Promise<Company[]> {
      return this.companiesService.searchCompanies(query);
    }

    @Get('statistics')
    async getStatistics() {
      return this.companiesService.getStatistics();
    }

    @Get('my-info')
    @UseGuards(AuthGuard('jwt')) 
    async getMyInfo(@Request() req: ExpressRequest): Promise<CompanyDocument> {
    const companyId = req.user?.id; 
  
    if (!companyId) {
      throw new NotFoundException("Compagnie non trouvée");
    }
  
    // Vérification explicite que `companyId` est bien une chaîne de caractères (string)
    if (typeof companyId !== 'string') {
      throw new NotFoundException("ID de compagnie invalide");
    }
  
    const company = await this.companiesService.findById(companyId);
    if (!company) {
      throw new NotFoundException("Compagnie non trouvée");
    }
  
    return company;
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Company> {
      const company = await this.companiesService.findOne(id);
      return company; // Le champ _id est automatiquement inclus
    }


    @Put('my-info')
@UseGuards(AuthGuard('jwt')) 
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
async updateMyProfile(
  @Request() req: ExpressRequest,
  @Body() companyData: Partial<Pick<CompanyDocument, 'name' | 'address' | 'phone' | 'taxId' | 'email' | 'logo' | 'signature'>>,
  @UploadedFiles()
  files: { logo?: Express.Multer.File[]; signature?: Express.Multer.File[] },
): Promise<CompanyDocument> {
  const companyId = req.user?.id;
  if (!companyId) {
    throw new NotFoundException("Compagnie non trouvée");
  }

  // Récupérer la compagnie existante avec un typage fort
  const existingCompany = await this.companiesService.findById(companyId);
  if (!existingCompany) {
    throw new NotFoundException("Compagnie non trouvée");
  }

  // Préparer les données de mise à jour avec un typage explicite
  const updateData: Partial<Pick<CompanyDocument, 'name' | 'address' | 'phone' | 'taxId' | 'email' | 'logo' | 'signature'>> = {
    ...companyData
  };

  // Gérer les fichiers avec vérification de type
  if (files.logo && files.logo[0]) {
    updateData.logo = files.logo[0].path;
  } else if (companyData.logo && typeof companyData.logo === 'string') {
    updateData.logo = existingCompany.logo;
  }

  if (files.signature && files.signature[0]) {
    updateData.signature = files.signature[0].path;
  } else if (companyData.signature && typeof companyData.signature === 'string') {
    updateData.signature = existingCompany.signature;
  }

  return this.companiesService.updateProfile(companyId, updateData);
}



    @Put('change-password')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(@Request() req: ExpressRequest, @Body('newPassword') newPassword: string): Promise<CompanyDocument> {
      const companyId = req.user?.id;
      if (!companyId) {
         throw new NotFoundException("Compagnie non trouvée");
      }

       // Hacher le nouveau mot de passe
       const hashedPassword = await bcrypt.hash(newPassword, 10);

       // Mettre à jour le mot de passe
       const updatedCompany = await this.companiesService.changePassword(companyId, hashedPassword);
       return updatedCompany;
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