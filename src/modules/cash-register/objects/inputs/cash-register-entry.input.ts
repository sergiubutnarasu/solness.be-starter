import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CashRegisterEntry } from '../entities';

@InputType({ isAbstract: true })
export class CreateCashRegisterEntryInput extends CashRegisterEntry {}

@InputType()
export class CashRegisterEntryInput extends OmitType(
  CreateCashRegisterEntryInput,
  ['enabled'],
) {
  @Field({ nullable: true })
  companyId: number;
}
