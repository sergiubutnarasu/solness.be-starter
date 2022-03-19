import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GenericResponse } from './generic.response';

export const GraphQLGenericResponse = <TItem>(
  classRef: Type<TItem>,
): Type<GenericResponse<TItem>> => {
  @ObjectType({ isAbstract: true })
  class GraphQLGenericResponseClass {
    @Field(() => classRef, { nullable: true })
    public data?: TItem;

    @Field()
    public success: boolean;

    @Field(() => [String], { nullable: true })
    public messages?: string[];
  }

  return GraphQLGenericResponseClass as Type<GenericResponse<TItem>>;
};
