import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, EncryptTransform } from '~/core';

@Entity('cashRegisterEntry')
@ObjectType()
@InputType({ isAbstract: true })
export class CashRegisterEntry extends BaseEntity {
  @Field()
  @Column()
  companyId: number;

  @ManyToOne('Company', { nullable: false })
  company?: unknown;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column({ length: 100 })
  docNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 100 })
  annexNumber: string;

  @Field()
  @Column({
    length: 250,
    transformer: EncryptTransform,
  })
  description: string;

  @Field()
  @Column({
    default: 0,
  })
  value: number;
}
