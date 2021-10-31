import { ObjectType } from '@nestjs/graphql';
import { GraphQLPaginatedResponse } from '~/modules/core';
import { User } from '../entities';

@ObjectType()
export class PaginatedUserResponse extends GraphQLPaginatedResponse(User) {}
