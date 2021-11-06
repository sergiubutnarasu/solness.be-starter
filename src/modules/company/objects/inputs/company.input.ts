import { InputType } from '@nestjs/graphql';
import { Company } from '../entities';

@InputType()
export class CompanyInput extends Company {}
