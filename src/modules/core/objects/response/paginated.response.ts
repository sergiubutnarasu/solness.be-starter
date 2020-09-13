import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function PaginatedResponse<TItem>(
  TItemClass: Type<TItem>,
  name: string = null,
): any {
  const className = name ?? TItemClass.name;

  @ObjectType(`Paginated${className}Response`)
  class PaginatedResponseClass {
    @Field(() => [TItemClass])
    public data: TItem[];
    @Field(() => Int)
    public total: number;
  }
  return PaginatedResponseClass;
}
