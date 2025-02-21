import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../schemas/user.schema';  // Vérifie que ce type est bien défini dans user.schema.ts

interface User {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class SuperAdminAdminRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    if (!user || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {  
      throw new ForbiddenException("Accès refusé. Seuls les admins et superAdmins sont autorisés.");
    }

    return true;
  }
}
