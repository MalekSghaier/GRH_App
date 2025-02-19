import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../schemas/user.schema';

interface User {
  id: string;
  role: UserRole;
}

@Injectable()
export class EmployeeInternGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    if (!user || (user.role !== UserRole.EMPLOYEE && user.role !== UserRole.INTERN)) {
      throw new ForbiddenException("Accès refusé. Seuls les employés et stagiaires sont autorisés.");
    }
    return true;
  }
}
