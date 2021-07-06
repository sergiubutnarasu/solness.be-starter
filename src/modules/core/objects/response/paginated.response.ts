import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function PaginatedResponse<TItem>(
  TItemClass: Type<TItem>,
  name: string = null,
): any {
  const className = name ?? TItemClass.name;

  @ObjectType(`Paginated${className}Response`)
  class PaginatedResponseClass {
    @Field(() => [TItemClass], { nullable: true })
    public data?: TItem[];

    @Field(() => Int)
    public total: number;

    @Field()
    public success: boolean;

    @Field({ nullable: true })
    public message?: string;
  }
  return PaginatedResponseClass;
}
