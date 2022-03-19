import { MiddlewareContext, NextFn } from '@nestjs/graphql';
import { UserContext } from '~/core';
import { checkPageAction } from '../helpers';
import { AccessType } from '../objects';

export const graphQlFieldAccess = (access: AccessType) => async (
  ctx: MiddlewareContext<any, { req: { user: UserContext } }>,
  next: NextFn,
) => {
  const value = await next();
  const user = ctx?.context?.req?.user;

  if (user) {
    const hasAccess = checkPageAction({
      user,
      page: access.page,
      action: access.action,
    });

    if (hasAccess) {
      return value;
    }
  }

  return null;
};
