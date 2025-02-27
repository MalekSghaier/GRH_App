// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service'; 
import { UserDocument } from '../schemas/user.schema';
import { CompanyDocument } from '../schemas/company.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService, 
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.authService.login(user);
  }

  @Post('login/company')
  async loginCompany(@Body() body: { email: string; password: string }) {
    const company = await this.authService.validateCompany(body.email, body.password);
    if (!company) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.authService.loginCompany(company);
  }

  @Post('register/user')
  async registerUser(@Body() user: UserDocument) {
    return await this.usersService.create(user); 
  }

  @Post('register/company')
  async registerCompany(@Body() company: CompanyDocument) {
    return await this.companiesService.create(company); 
  }
}