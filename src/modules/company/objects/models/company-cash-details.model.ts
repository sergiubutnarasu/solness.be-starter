import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyCashDetails {
  @Field({ nullable: true })
  initialCashIndex?: number;

  @Field({ nullable: true })
  initialCashValue?: number;
}
