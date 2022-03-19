import { ObjectType } from '@nestjs/graphql';
import { GraphQLPaginatedResponse } from '~/core';
import { User } from '~/shared/user';

@ObjectType()
export class PaginatedUserResponse extends GraphQLPaginatedResponse(User) {}
