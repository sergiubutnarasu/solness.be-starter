import { Field, ObjectType } from '@nestjs/graphql';
import { CashRegisterEntry } from '../entities';

@ObjectType()
export class CashRegisterEntryDetails {
  @Field()
  previousTotalValue: number;

  @Field()
  previousEntriesCount: number;

  @Field(() => [CashRegisterEntry])
  entries: CashRegisterEntry[];
}
