import { InputType, OmitType } from '@nestjs/graphql';
import { CompanyUser } from '../entities';

@InputType({ isAbstract: true })
export class CreateCompanyUserInput extends CompanyUser {}

@InputType()
export class CompanyUserInput extends OmitType(CreateCompanyUserInput, [
  'user',
  'verified',
]) {}
