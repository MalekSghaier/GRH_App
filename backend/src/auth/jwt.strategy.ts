import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecretKey',
    });
  }

  async validate(payload: { sub: string; email: string; role: string; companyName?: string }) {
    if (payload.role === 'admin') {
      const company = await this.companiesService.findById(payload.sub);
      if (!company || !company._id) {
        return null;
      }

      return {
        sub: company._id.toString(), 
        id: company._id.toString(),
        email: payload.email, // Utilise l'email du JWT plutôt que de la base
        role: payload.role,
        companyName: payload.companyName || company.name
      };
    } else {
      // Partie utilisateur inchangée
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        return null;
      }
      return user;
    }
  }
}