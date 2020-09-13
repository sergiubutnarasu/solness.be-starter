import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('RelationModelInput')
export class RelationModel {
  @Field()
  id: number;

  @Field({ nullable: true })
  name?: string;
}
