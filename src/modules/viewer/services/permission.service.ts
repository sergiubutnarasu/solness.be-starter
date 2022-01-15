import { Injectable } from '@nestjs/common';
import {
  checkCompanyPageActions,
  checkDefaultPageActions,
} from '~/modules/auth/helpers';
import { Page } from '~/modules/auth/objects';
import { UserContext } from '~/modules/core';
import { Permission } from '../objects';

@Injectable()
export class PermissionService {
  public compute(user: UserContext): Permission {
    const userActions = checkDefaultPageActions(user, Page.User);
    const companyActions = checkCompanyPageActions(user);

    return { user: userActions, company: companyActions };
  }
}
