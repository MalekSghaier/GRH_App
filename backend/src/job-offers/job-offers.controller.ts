import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete,
    BadRequestException,
    UseGuards
  } from '@nestjs/common';
  import { JobOffersService } from './job-offers.service';
  import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
  
  @Controller('job-offers')
  export class JobOffersController {
    constructor(private readonly jobOffersService: JobOffersService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() offerData: {
      title: string;
      description: string;
      company: string;
      location: string;
      experienceRequired: number;
      educationLevel: string;
      jobRequirements: string;
    }) {
      return this.jobOffersService.create(offerData);
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
      return this.jobOffersService.findAll();
    }
  
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.jobOffersService.findById(id);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
      @Param('id') id: string,
      @Body() offerData: Partial<{
        title: string;
        description: string;
        company: string;
        location: string;
        experienceRequired: number;
        educationLevel: string;
        jobRequirements: string;
      }>
    ) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.jobOffersService.update(id, offerData);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.jobOffersService.delete(id);
    }
  }