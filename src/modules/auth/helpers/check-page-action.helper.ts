import { CompanyRole, UserContext } from '~/modules/core';
import { CompanyActionsMapping, UserActionsMapping } from '../configs';
import { CompanyActionType, LocationType, UserActionType } from '../objects';

type Action = UserActionType | CompanyActionType;

const checkPageAction = ({
  user,
  page,
  action,
}: {
  user: UserContext;
  page: LocationType;
  action: Action;
}) => {
  if (user.data.isAdmin) {
    return true;
  }

  const companyRoles = (user.data.companyRoles as CompanyRole[]) ?? [];
  let roles = [];

  switch (page) {
    case 'User': {
      roles = UserActionsMapping[action];
      break;
    }
    case 'Company': {
      roles = CompanyActionsMapping[action];
      break;
    }
  }

  return (roles ?? []).some((role) =>
    companyRoles.some((companyRole) => companyRole === role),
  );
};

export default checkPageAction;
