import { Field, InputType } from '@nestjs/graphql';
import { CompanyUserInput } from '.';
import { Company } from '../entities';

@InputType({ isAbstract: true })
export class CreateCompanyInput extends Company {}

@InputType()
export class CompanyInput extends Company {
  @Field(() => [CompanyUserInput], { nullable: true })
  users?: CompanyUserInput[];
}
