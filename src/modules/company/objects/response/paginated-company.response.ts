import { ObjectType } from '@nestjs/graphql';
import { GraphQLPaginatedResponse } from '~/modules/core';
import { Company } from '../entities';

@ObjectType()
export class PaginatedCompanyResponse extends GraphQLPaginatedResponse(
  Company,
) {}
