import { CompanyRole, UserContext } from '~/core';
import {
  CashActionsMapping,
  CompanyActionsMapping,
  InventoryActionsMapping,
  UserActionsMapping,
} from '../configs';
import {
  CashActionType,
  CompanyActionType,
  InventoryActionType,
  Page,
  UserActionType,
} from '../objects';

type Action =
  | UserActionType
  | CompanyActionType
  | CashActionType
  | InventoryActionType;

const checkPageAction = ({
  user,
  page,
  action,
}: {
  user: UserContext;
  page: Page;
  action: Action;
}) => {
  if (user.data.isAdmin) {
    return true;
  }

  const companyRoles = (user.data.companyRoles as CompanyRole[]) ?? [];
  let roles = [];

  switch (page) {
    case Page.User: {
      roles = UserActionsMapping[action];
      break;
    }
    case Page.Company: {
      roles = CompanyActionsMapping[action];
      break;
    }
    case Page.Cash: {
      roles = CashActionsMapping[action];
      break;
    }
    case Page.Inventory: {
      roles = InventoryActionsMapping[action];
      break;
    }
  }

  return (roles ?? []).some((role) =>
    companyRoles.some((companyRole) => companyRole === role),
  );
};

export default checkPageAction;
