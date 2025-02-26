//work-applications.controller.ts
import { Controller, Get, Post, Body,Put, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
    if (!files.cv || !files.coverLetter) {
      throw new Error('CV et lettre de motivation requis');
    }
  
    body.cv = files.cv[0].filename;
    body.coverLetter = files.coverLetter[0].filename;
  
    return this.workApplicationsService.create(body);
  }  

  @Get()
  async findAll(): Promise<WorkApplication[]> {
    return this.workApplicationsService.findAll();
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
