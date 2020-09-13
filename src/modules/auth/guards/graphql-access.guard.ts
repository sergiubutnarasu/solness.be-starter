import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphQlAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classHandler = context.getClass();
    const methodHandler = context.getHandler();

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (user?.data?.isAdmin) {
      return true;
    }

    const accessType = this.reflector.get<string>('access', methodHandler);
    const moduleType = this.reflector.get<string>('access', classHandler);

    const hasPrivileges = () =>
      user?.data?.privileges?.some(
        (item) => item.module === moduleType && item[accessType] === 1,
      );

    return hasPrivileges();
  }
}
