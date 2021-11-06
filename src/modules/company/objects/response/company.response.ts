import { ObjectType } from '@nestjs/graphql';
import { GraphQLGenericResponse } from '~/modules/core';
import { Company } from '../entities';

@ObjectType()
export class CompanyResponse extends GraphQLGenericResponse(Company) {}
