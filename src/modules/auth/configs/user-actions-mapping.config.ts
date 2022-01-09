import { CompanyRole } from '~/modules/core';
import { UserActionType } from '../objects';

export const UserActionsMapping: Record<UserActionType, CompanyRole[]> = {
  view: [CompanyRole.Owner, CompanyRole.User],
  create: [CompanyRole.Owner],
  update: [CompanyRole.Owner],
  delete: [CompanyRole.Owner],
};
