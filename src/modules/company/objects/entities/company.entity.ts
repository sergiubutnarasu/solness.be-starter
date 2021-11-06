import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity, EncryptTransform } from '~/modules/core';

@Entity()
@ObjectType()
@InputType({ isAbstract: true })
export class Company extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column({
    length: 150,
    unique: true,
    transformer: EncryptTransform,
  })
  email: string;

  @Field()
  @Column({
    unique: true,
    transformer: EncryptTransform,
  })
  phone: string;
}
