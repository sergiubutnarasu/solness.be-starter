import { ObjectType } from '@nestjs/graphql';
import { GraphQLGenericResponse } from '~/modules/core';
import { User } from '../entities';

@ObjectType()
export class UserResponse extends GraphQLGenericResponse(User) {}
