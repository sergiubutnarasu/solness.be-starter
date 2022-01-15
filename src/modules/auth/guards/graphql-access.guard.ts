import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkPageAction, getCurrentUser } from '../helpers';
import { AccessType } from '../objects';

@Injectable()
export class GraphQlAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classHandler = context.getClass();
    const methodHandler = context.getHandler();

    const user = getCurrentUser(context);

    let access = this.reflector.get<AccessType>('access', methodHandler);
    if (!access) {
      access = this.reflector.get<AccessType>('access', classHandler);
    }

    if (!access) {
      return true;
    }

    return checkPageAction({
      user,
      page: access.page,
      action: access.action,
    });
  }
}
