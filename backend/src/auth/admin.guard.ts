//admin.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../schemas/user.schema';  // Importer UserRole

interface User {
  id: string;
  email: string;
  role: UserRole;  // Assurez-vous que le type correspond à UserRole
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    if (!user || user.role !== UserRole.ADMIN) {  
      throw new ForbiddenException("Accès refusé. Seuls les admins sont autorisés.");
    }
    return true;
  }
}
