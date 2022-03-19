import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class BasePageListInput {
  @Field({ defaultValue: 0, nullable: true })
  page?: number;

  @Field({ defaultValue: 10, nullable: true })
  pageSize?: number;
}
