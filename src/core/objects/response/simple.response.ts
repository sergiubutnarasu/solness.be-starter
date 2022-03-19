import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './generic.response';

@ObjectType()
export class SimpleResponse implements BaseResponse {
  @Field()
  success: boolean;

  @Field(() => [String], { nullable: true })
  messages?: string[];
}
