import { CompanyRole } from '~/core';
import { CompanyActionType } from '../objects';

export const CompanyActionsMapping: Record<CompanyActionType, CompanyRole[]> = {
  view: [CompanyRole.Owner, CompanyRole.User],
  create: [],
  update: [CompanyRole.Owner],
  delete: [],
  inviteUser: [CompanyRole.Owner],
  excludeUser: [CompanyRole.Owner],
};
