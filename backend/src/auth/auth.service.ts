import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';
import { CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async validateCompany(email: string, password: string): Promise<CompanyDocument | null> {
    const company = await this.companiesService.findByEmail(email);
    if (company && (await company.comparePassword(password))) {
      return company;
    }
    return null;
  }

  login(user: UserDocument): { access_token: string; role: string } {
    const payload = { email: user.email, sub: user._id, role: user.role }; // Inclure le rôle de l'utilisateur
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  loginCompany(company: CompanyDocument): { access_token: string; role: string } {
    const payload = { email: company.email, sub: company._id, role: 'admin' }; // Rôle 'admin' pour les entreprises
    return {
      access_token: this.jwtService.sign(payload),
      role: 'admin',
    };
  }
}