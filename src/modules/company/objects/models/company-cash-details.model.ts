import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyCashDetails {
  @Field(() => Int, { nullable: true })
  initialCashIndex?: number;

  @Field({ nullable: true })
  initialCashValue?: number;
}
