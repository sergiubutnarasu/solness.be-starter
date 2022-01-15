import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getCurrentUser } from '../helpers';
@Injectable()
export class GraphQlAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = getCurrentUser(context);

    return Boolean(user.data.isAdmin);
  }
}
