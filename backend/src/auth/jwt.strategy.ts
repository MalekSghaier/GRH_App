import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service'; // Importez le service des entreprises
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService, // Injectez le service des entreprises
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecretKey',
    });
  }

  async validate(payload: { sub: string; email: string; role: string ;companyName?: string}) {
    // Vérifiez si le token appartient à un utilisateur ou à une entreprise
    if (payload.role === 'admin') {
      // Si le rôle est 'admin', c'est une entreprise
      const company = await this.companiesService.findById(payload.sub);
      if (!company) {
        return null;
      }
      return {
        id: company._id,
        email: company.email,
        role: payload.role,
        companyName: payload.companyName || company.name // Fallback au cas où
      };
      } else {
      // Sinon, c'est un utilisateur
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        return null;
      }
      return user;
    }
  }
}