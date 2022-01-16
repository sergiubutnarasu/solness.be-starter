import { CompanyRole } from '~/modules/core';
import { CashActionType } from '../objects';

export const CashActionsMapping: Record<CashActionType, CompanyRole[]> = {
  view: [CompanyRole.Owner],
  create: [CompanyRole.Owner],
  update: [CompanyRole.Owner],
  delete: [CompanyRole.Owner],
};
