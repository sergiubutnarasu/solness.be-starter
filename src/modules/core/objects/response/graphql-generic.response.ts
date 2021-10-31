import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../entities';
import { GenericResponse } from './generic.response';

export const GraphQLGenericResponse = <TItem extends BaseEntity>(
  classRef: Type<TItem>,
): Type<GenericResponse<TItem>> => {
  @ObjectType({ isAbstract: true })
  class GraphQLGenericResponseClass {
    @Field(() => classRef, { nullable: true })
    public data?: TItem;

    @Field()
    public success: boolean;

    @Field({ nullable: true })
    public message?: string;
  }

  return GraphQLGenericResponseClass as Type<GenericResponse<TItem>>;
};
