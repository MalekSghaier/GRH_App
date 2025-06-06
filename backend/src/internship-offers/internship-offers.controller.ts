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
    Request,
    Query
  } from '@nestjs/common';
  import { InternshipOffersService } from './internship-offers.service';
  import { Types } from 'mongoose';
  import { AuthGuard } from '@nestjs/passport';
  import { UserPayload } from '../schemas/user-payload';
import { InternshipOffer } from 'src/schemas/internship-offer.schema';
  
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
    findAll() {
      return this.internshipOffersService.findAll();
    }
  
    @Get('my-offers')
    @UseGuards(AuthGuard('jwt'))
    findMyOffers(@Request() req: { user: UserPayload }) {
      return this.internshipOffersService.findByCompany(req.user.id);
    }

    @Get('search')
    async searchOffers(
     @Request() req: { user: UserPayload },
     @Query('query') query: string
     ): Promise<InternshipOffer[]> {
     if (!query || query.trim() === '') {
       return this.internshipOffersService.findByCompany(req.user.id);
     }
       return this.internshipOffersService.searchOffers(
    query, 
    new Types.ObjectId(req.user.id)
  );
  }

  @Get('public/search')
  async publicSearchOffers(
    @Query('query') query: string,
    @Query('duration') duration?: number,
    @Query('educationLevel') educationLevel?: string,
    @Query('requirements') requirements?: string
  ): Promise<InternshipOffer[]> {
    return this.internshipOffersService.publicSearchOffers(
      query || '',
      duration,
      educationLevel,
      requirements
    );
  }
@Get('public/all')
async getAllPublicOffers(): Promise<InternshipOffer[]> {
  return this.internshipOffersService.findAll();
}
  @Get('my-offers/count')
  @UseGuards(AuthGuard('jwt'))
  async countMyOffers(@Request() req: { user: UserPayload }) {
    return this.internshipOffersService.countByCompany(req.user.id);
  }
  
    @Get(':id')
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