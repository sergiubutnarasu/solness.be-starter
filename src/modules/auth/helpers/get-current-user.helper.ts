import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserContext } from '~/core';

const getCurrentUser = (context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  return ctx.getContext().req.user as UserContext;
};

export default getCurrentUser;
