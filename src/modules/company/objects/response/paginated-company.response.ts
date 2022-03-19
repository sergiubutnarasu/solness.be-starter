import { ObjectType } from '@nestjs/graphql';
import { GraphQLPaginatedResponse } from '~/core';
import { Company } from '../entities';

@ObjectType()
export class PaginatedCompanyResponse extends GraphQLPaginatedResponse(
  Company,
) {}
