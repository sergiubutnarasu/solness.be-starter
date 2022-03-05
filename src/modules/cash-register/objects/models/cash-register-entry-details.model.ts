import { Field, ObjectType } from '@nestjs/graphql';
import { CompanyCashDetails } from '~/modules/company/objects';
import { CashRegisterEntry } from '../entities';

@ObjectType()
export class CashRegisterEntryDetails {
  @Field(() => CompanyCashDetails)
  companyCashDetails: CompanyCashDetails;

  @Field()
  previousTotalValue: number;

  @Field()
  previousEntriesCount: number;

  @Field(() => [CashRegisterEntry])
  entries: CashRegisterEntry[];
}
