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
    const cashActions = checkDefaultPageActions(user, Page.Cash);
    const inventoryActions = checkDefaultPageActions(user, Page.Inventory);

    return {
      user: userActions,
      company: companyActions,
      cash: cashActions,
      inventory: inventoryActions,
    };
  }
}
