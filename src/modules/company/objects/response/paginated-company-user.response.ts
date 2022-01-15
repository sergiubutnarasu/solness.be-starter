import { ObjectType } from '@nestjs/graphql';
import { GraphQLPaginatedResponse } from '~/modules/core';
import { CompanyUser } from '../entities';

@ObjectType()
export class PaginatedCompanyUserResponse extends GraphQLPaginatedResponse(
  CompanyUser,
) {}
