import { ObjectType } from '@nestjs/graphql';
import { GraphQLGenericResponse } from '~/modules/core';
import { TokenPayload } from '../models';

@ObjectType()
export class TokenResponse extends GraphQLGenericResponse(TokenPayload) {}
