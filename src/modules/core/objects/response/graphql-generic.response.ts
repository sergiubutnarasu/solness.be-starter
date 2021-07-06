import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export function GraphQLGenericResponse<TItem>(
  TItemClass: Type<TItem>,
  name: string = null,
): any {
  const className = name ?? TItemClass.name;

  @ObjectType(`${className}Response`)
  class GraphQLGenericResponseClass {
    @Field(() => TItemClass, { nullable: true })
    public data?: TItem;

    @Field()
    public success: boolean;

    @Field({ nullable: true })
    public message?: string;
  }

  return GraphQLGenericResponseClass;
}
