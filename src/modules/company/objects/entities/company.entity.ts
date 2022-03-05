import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { graphQlFieldAccess } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
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
    transformer: EncryptTransform,
  })
  slogan: string;

  @Field({ nullable: true })
  @Column({
    length: 1500,
    nullable: true,
    transformer: EncryptTransform,
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

  @Field({ nullable: true })
  @Column({
    nullable: true,
    length: 250,
    transformer: EncryptTransform,
  })
  website: string;

  @Field({
    nullable: true,
    middleware: [graphQlFieldAccess({ page: Page.Cash, action: 'view' })],
  })
  @Column({
    nullable: true,
    transformer: EncryptTransform,
    length: 150,
  })
  initialCashValue: string;

  @Field(() => Int, {
    nullable: true,
    middleware: [graphQlFieldAccess({ page: Page.Cash, action: 'view' })],
  })
  @Column({ nullable: true })
  initialCashIndex?: number;

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company)
  users?: CompanyUser[];
}
