import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class InviteUserInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
