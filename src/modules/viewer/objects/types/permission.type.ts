import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyAction } from './company-action.type';
import { UserAction } from './user-action.type';

@ObjectType()
export class Permission {
  @Field(() => UserAction)
  user: UserAction;

  @Field(() => CompanyAction)
  company: CompanyAction;
}
