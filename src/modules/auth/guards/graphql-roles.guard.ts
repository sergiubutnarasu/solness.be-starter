import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '~/core';
import { getCurrentUser } from '../helpers';

@Injectable()
export class GraphQlRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classHandler = context.getClass();
    const methodHandler = context.getHandler();

    let roles = this.reflector.get<Role[]>('roles', methodHandler);
    if (!roles) {
      roles = this.reflector.get<Role[]>('roles', classHandler);
    }

    if (!roles) {
      return true;
    }

    const user = getCurrentUser(context);

    if (user?.data?.isAdmin) {
      return true;
    }

    const hasRole = () => roles.some((role) => role === user.role);
    return user && user.role && hasRole();
  }
}
