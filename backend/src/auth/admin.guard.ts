import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../schemas/user.schema';  // Importer UserRole

interface User {
  id: string;
  email: string;
  role: UserRole;  
  companyName?: string;  // Optionnel pour les compagnies
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    // Vérifier si l'utilisateur est un admin ou une compagnie
    if (!user || (user.role !== UserRole.ADMIN && !user.companyName)) {  
      throw new ForbiddenException("Accès refusé. Seuls les admins et les compagnies sont autorisés.");
    }
    return true;
  }
}