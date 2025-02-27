// autorisation pour les utilisateurs dont leurs role est superAdmin 
//roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined; 

    if (!user || user.role !== 'superAdmin') {
      throw new ForbiddenException("Accès refusé. Seuls les superAdmins sont autorisés.");
    }
    
    return true;
  }
}
