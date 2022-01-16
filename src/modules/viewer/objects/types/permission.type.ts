import { Field, ObjectType } from '@nestjs/graphql';
import { CashAction } from './cash-action.type';
import { CompanyAction } from './company-action.type';
import { InventoryAction } from './inventory-action.type';
import { UserAction } from './user-action.type';

@ObjectType()
export class Permission {
  @Field(() => UserAction)
  user: UserAction;

  @Field(() => CompanyAction)
  company: CompanyAction;

  @Field(() => CashAction)
  cash: CashAction;

  @Field(() => InventoryAction)
  inventory: InventoryAction;
}
