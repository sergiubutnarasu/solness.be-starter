import { Injectable } from '@nestjs/common';
import { checkDefaultPageActions, UserContext } from '~/modules/core';
import { Permission } from '../objects';

@Injectable()
export class PermissionService {
  public compute(user: UserContext): Permission {
    const userActions = checkDefaultPageActions(user, 'User');
    const companyActions = checkDefaultPageActions(user, 'Company');

    return { user: userActions, company: companyActions };
  }
}
