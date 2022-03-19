import { ObjectType } from '@nestjs/graphql';
import { GraphQLGenericResponse } from '~/core';
import { Company } from '../entities';

@ObjectType()
export class CompanyResponse extends GraphQLGenericResponse(Company) {}
