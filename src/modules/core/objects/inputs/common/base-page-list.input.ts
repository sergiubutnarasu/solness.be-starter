import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class BasePageListInput {
  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  pageSize: number;
}
