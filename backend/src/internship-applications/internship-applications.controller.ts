//internship-applications.controller.ts
import { Controller, Get, Post, Body, Param,Put, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { InternshipApplicationsService } from './internship-applications.service';
import { InternshipApplication } from '../schemas/internship-application.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('internship-applications')
export class InternshipApplicationsController {
  constructor(private readonly internshipApplicationsService: InternshipApplicationsService) {}

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
    if (!files.cv || !files.coverLetter) {
      throw new Error('CV et lettre de motivation requis');
    }
  
    body.cv = files.cv[0].filename;
    body.coverLetter = files.coverLetter[0].filename;
  
    return this.internshipApplicationsService.create(body);
  }  

  @Get()
  async findAll(): Promise<InternshipApplication[]> {
    return this.internshipApplicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InternshipApplication> {
    return this.internshipApplicationsService.findOne(id);
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
