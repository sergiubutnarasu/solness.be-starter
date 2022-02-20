import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CompanyUserInput } from '.';
import { Company } from '../entities';

@InputType({ isAbstract: true })
export class CreateCompanyInput extends Company {}

@InputType()
export class CompanyInput extends OmitType(CreateCompanyInput, [
  'users',
  'enabled',
  'initialCashValue',
]) {
  @Field(() => [CompanyUserInput], { nullable: true })
  users?: CompanyUserInput[];
}
