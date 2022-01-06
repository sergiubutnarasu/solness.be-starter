import { Field, ObjectType } from '@nestjs/graphql';
import { UserAction } from '.';

@ObjectType()
export class Permission {
  @Field(() => UserAction)
  user: UserAction;
}
