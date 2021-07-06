import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '~/modules/core';
import { User } from '~/modules/user';

@Entity()
@ObjectType()
@InputType({ isAbstract: true })
export class Company extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'companyUsers' })
  users: User[];
}
