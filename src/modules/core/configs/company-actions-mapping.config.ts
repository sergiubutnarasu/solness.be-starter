import { CompanyActionType, CompanyRole } from '../objects';

export const CompanyActionsMapping: Record<CompanyActionType, CompanyRole[]> = {
  view: [CompanyRole.Owner, CompanyRole.User],
  create: [],
  update: [CompanyRole.Owner],
  delete: [],
};
