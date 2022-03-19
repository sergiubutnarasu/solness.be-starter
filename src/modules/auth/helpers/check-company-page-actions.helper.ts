import { UserContext } from '~/core';
import { CompanyActionType, Page } from '../objects';
import checkDefaultPageActions from './check-default-page-actions.helper';
import checkPageAction from './check-page-action.helper';

const checkCompanyPageActions = (
  user: UserContext,
): Record<CompanyActionType, boolean> => ({
  ...checkDefaultPageActions(user, Page.Company),
  inviteUser: checkPageAction({
    user,
    page: Page.Company,
    action: 'inviteUser',
  }),
  excludeUser: checkPageAction({
    user,
    page: Page.Company,
    action: 'excludeUser',
  }),
});

export default checkCompanyPageActions;
