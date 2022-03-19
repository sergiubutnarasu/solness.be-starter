import { ObjectType } from '@nestjs/graphql';
import { GraphQLGenericResponse } from '~/core';
import { User } from '~/shared/user';

@ObjectType()
export class UserResponse extends GraphQLGenericResponse(User) {}
