import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../entities';
import { PaginatedResponse } from './paginated.response';

export const GraphQLPaginatedResponse = <T extends BaseEntity>(
  classRef: Type<T>,
): Type<PaginatedResponse<T>> => {
  @ObjectType({ isAbstract: true })
  class GraphQLPaginatedResponseClass {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => Int)
    public total: number;
  }

  return GraphQLPaginatedResponseClass as Type<PaginatedResponse<T>>;
};
