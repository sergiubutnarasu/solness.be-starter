import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphQlRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classHandler = context.getClass();
    const methodHandler = context.getHandler();

    let roles = this.reflector.get<string[]>('roles', methodHandler);
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', classHandler);
    }

    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    const hasRole = () => roles.some((role) => role === user.role);
    return user && user.role && hasRole();
  }
}
