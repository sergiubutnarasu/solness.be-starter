import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CompanyCashDetailsInput {
  @Field(() => Int, { nullable: true })
  initialCashIndex?: number;

  @Field({ nullable: true })
  initialCashValue?: number;
}
