import { ActionType, LocationType, UserContext } from '../objects';
import checkPageAction from './check-page-action.helper';

const checkDefaultPageActions = (
  user: UserContext,
  page: LocationType,
): Record<ActionType, boolean> => ({
  view: checkPageAction({ user, page, action: 'view' }),
  create: checkPageAction({ user, page, action: 'create' }),
  update: checkPageAction({ user, page, action: 'update' }),
  delete: checkPageAction({ user, page, action: 'delete' }),
});

export default checkDefaultPageActions;
