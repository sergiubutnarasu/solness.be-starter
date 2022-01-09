import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class BaseAction {
  @Field()
  public view: boolean;

  @Field()
  public create: boolean;

  @Field()
  public update: boolean;

  @Field()
  public delete: boolean;
}
