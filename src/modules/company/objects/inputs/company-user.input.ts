import { InputType } from '@nestjs/graphql';
import { CompanyUser } from '../entities';

@InputType()
export class CompanyUserInput extends CompanyUser {}
