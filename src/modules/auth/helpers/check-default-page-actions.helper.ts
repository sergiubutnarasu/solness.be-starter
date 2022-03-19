import { UserContext } from '~/core';
import { BaseActionType, Page } from '../objects';
import checkPageAction from './check-page-action.helper';

const checkDefaultPageActions = (
  user: UserContext,
  page: Page,
): Record<BaseActionType, boolean> => ({
  view: checkPageAction({ user, page, action: 'view' }),
  create: checkPageAction({ user, page, action: 'create' }),
  update: checkPageAction({ user, page, action: 'update' }),
  delete: checkPageAction({ user, page, action: 'delete' }),
});

export default checkDefaultPageActions;
