import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity, EncryptTransform, Role } from '~/core';

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

  @Column({ default: false })
  @Field()
  verified: boolean;

  @Field()
  @Column({ length: 150, transformer: EncryptTransform })
  firstName: string;

  @Field()
  @Column({ length: 150, transformer: EncryptTransform })
  lastName: string;

  @Field({ nullable: true })
  @Column({ length: 250, nullable: true, transformer: EncryptTransform })
  title?: string;

  @Field({ nullable: true })
  @Column({ length: 650, nullable: true, transformer: EncryptTransform })
  description?: string;

  @Column({ length: 250, select: false })
  password: string;

  @Field()
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role?: Role;
}
