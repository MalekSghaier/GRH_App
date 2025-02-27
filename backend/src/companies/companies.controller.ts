import {Controller,Get,Post,Put,Delete,Body,Param,UseGuards,} from '@nestjs/common';
  import { CompaniesService } from './companies.service';
  import { Company } from '../schemas/company.schema';
  import { AuthGuard } from '@nestjs/passport';
  import {SuperAdminAdminRolesGuard} from '../auth/SuperAdmin_Admin_roles.guard';
  @Controller('companies')
  @UseGuards(AuthGuard('jwt'),SuperAdminAdminRolesGuard) 
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}
  
    @Post()
    async create(@Body() company: Company) {
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