import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, EncryptTransform } from '~/modules/core';
import { CompanyUser } from './company-user.entity';

@Entity()
@ObjectType()
@InputType({ isAbstract: true })
export class Company extends BaseEntity {
  @Field()
  @Column({
    length: 250,
    transformer: EncryptTransform,
  })
  name: string;

  @Field({ nullable: true })
  @Column({
    length: 250,
    nullable: true,
  })
  slogan: string;

  @Field({ nullable: true })
  @Column({
    length: 1000,
    nullable: true,
  })
  description: string;

  @Field()
  @Column({
    length: 150,
    transformer: EncryptTransform,
  })
  email: string;

  @Field()
  @Column({
    length: 150,
    unique: true,
    transformer: EncryptTransform,
  })
  registerNumber: string;

  @Field()
  @Column({
    length: 150,
    unique: true,
    transformer: EncryptTransform,
  })
  phone: string;

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company)
  users?: CompanyUser[];
}
