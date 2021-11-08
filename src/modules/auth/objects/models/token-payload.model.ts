import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;

  signature?: string;
}
