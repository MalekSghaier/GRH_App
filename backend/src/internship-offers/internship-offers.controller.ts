// src/internship-offers/internship-offers.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete,
    BadRequestException,
    UseGuards,
    Request
  } from '@nestjs/common';
  import { InternshipOffersService } from './internship-offers.service';
  import { Types } from 'mongoose';
  import { AuthGuard } from '@nestjs/passport';
  import { UserPayload } from '../schemas/user-payload';
  
  @Controller('internship-offers')
  export class InternshipOffersController {
    constructor(private readonly internshipOffersService: InternshipOffersService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(
      @Request() req: { user: UserPayload },
      @Body() offerData: {
        title: string;
        description: string;
        company: string;
        location: string;
        duration: number;
        educationLevel: string;
        requirements: string;
      }
    ) {
      return this.internshipOffersService.create({
        ...offerData,
        createdBy: new Types.ObjectId(req.user.id)
      });
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
      return this.internshipOffersService.findAll();
    }
  
    @Get('my-offers')
    @UseGuards(AuthGuard('jwt'))
    findMyOffers(@Request() req: { user: UserPayload }) {
      return this.internshipOffersService.findByCompany(req.user.id);
    }
  
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.internshipOffersService.findById(id);
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
        duration: number;
        educationLevel: string;
        requirements: string;
      }>
    ) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.internshipOffersService.update(id, offerData);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId');
      }
      return this.internshipOffersService.delete(id);
    }
  }