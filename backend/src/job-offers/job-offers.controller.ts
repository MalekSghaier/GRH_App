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
  import { JobOffersService } from './job-offers.service';
  import { Types } from 'mongoose';
  import { AuthGuard } from '@nestjs/passport';
  import { UserPayload } from 'src/schemas/user-payload';
import { JobOfferDocument } from 'src/schemas/job-offer.schema';

  
  @Controller('job-offers')
  export class JobOffersController {
    constructor(private readonly jobOffersService: JobOffersService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(
      @Request() req: { user: UserPayload },
      @Body() offerData: {
        title: string;
        description: string;
        company: string;
        location: string;
        experienceRequired: number;
        educationLevel: string;
        jobRequirements: string;
      }
    ) {
      return this.jobOffersService.create({
        ...offerData,
        createdBy: new Types.ObjectId(req.user.id) // Conversion en ObjectId
      });
    }
  
    @Get()
    findAll() {
      return this.jobOffersService.findAll();
    }

    @Get('my-offers')
    @UseGuards(AuthGuard('jwt'))
    findMyOffers(@Request() req: { user: UserPayload }) {
      return this.jobOffersService.findByCompany(req.user.id); // Utilisez id
    }

    @Get('search')
    @UseGuards(AuthGuard('jwt'))
    async searchJobOffers(
      @Request() req: { user: UserPayload },
      @Query('query') query: string
    ): Promise<JobOfferDocument[]> {
      if (!query || query.trim() === '') {
        return this.jobOffersService.findByCompany(req.user.id);
      }
      
      return this.jobOffersService.searchJobOffers(
        query, 
        new Types.ObjectId(req.user.id)
      );
    }

    @Get('my-offers/count')
    @UseGuards(AuthGuard('jwt'))
    async countMyOffers(@Request() req: { user: UserPayload }) {
      return this.jobOffersService.countByCompany(req.user.id);
    }
    @Get('public/search')
      async publicSearchOffers(
        @Query('query') query: string,
        @Query('experienceRequired') experienceRequired?: number,
        @Query('educationLevel') educationLevel?: string,
        @Query('jobRequirements') jobRequirements?: string 
      ): Promise<JobOfferDocument[]> {
        return this.jobOffersService.publicSearchOffers(
          query || '',
          experienceRequired,
          educationLevel,
          jobRequirements 

        );
    }
  
    @Get(':id')
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