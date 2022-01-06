import { Injectable } from '@nestjs/common';
import { CompanyRole, UserContext } from '~/modules/core';
import { UserAction } from '../objects';

@Injectable()
export class UserActionService {
  public compute(user: UserContext): UserAction {
    if (user.data.isAdmin || user.data.companyRole === CompanyRole.Owner) {
      return {
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      };
    }

    return {
      canView: true,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
  }
}
