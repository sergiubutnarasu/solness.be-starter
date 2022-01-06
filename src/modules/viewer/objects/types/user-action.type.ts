import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAction {
  @Field()
  public canView: boolean;

  @Field()
  public canCreate: boolean;

  @Field()
  public canUpdate: boolean;

  @Field()
  public canDelete: boolean;
}
