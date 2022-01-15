import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAction } from './base-action.type';

@ObjectType({ implements: () => [BaseAction] })
export class CompanyAction extends BaseAction {
  @Field()
  public inviteUser: boolean;

  @Field()
  public excludeUser: boolean;
}
