import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity, EncryptTransform, Role } from '~/modules/core';

@Entity()
@ObjectType()
@InputType({ isAbstract: true })
export class User extends BaseEntity {
  @Field()
  @Column({
    length: 150,
    unique: true,
    transformer: EncryptTransform,
  })
  email: string;

  @Field()
  @Column({ length: 50 })
  firstName: string;

  @Field()
  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 250, select: false })
  password: string;

  @Field()
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
