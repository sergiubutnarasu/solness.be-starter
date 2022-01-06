import { Injectable } from '@nestjs/common';
import { UserContext } from '~/modules/core';
import { Permission } from '../objects';
import { UserActionService } from './user-action.service';

@Injectable()
export class PermissionService {
  constructor(private readonly userActionService: UserActionService) {}

  public compute(user: UserContext): Permission {
    const userActions = this.userActionService.compute(user);

    return { user: userActions };
  }
}
