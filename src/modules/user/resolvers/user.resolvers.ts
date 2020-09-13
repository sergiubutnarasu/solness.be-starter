import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '~/modules/core';
import { User, UserInput } from '../objects';
import { UserService } from '../services';

const UserBaseResolver = createBaseResolver<User, UserInput, UserService>(
  'User',
  User,
  UserInput,
);

// @UseGuards(GraphQlAuthGuard, GraphQlRolesGuard)
// @Roles(Role.Admin)
@Resolver(() => User)
export class UserResolver extends UserBaseResolver {
  constructor(service: UserService) {
    super(service);
  }
}
