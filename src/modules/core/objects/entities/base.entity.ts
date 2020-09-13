import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  @Field(() => Int, { nullable: true })
  id?: number;

  @Column()
  @Field()
  enabled: boolean;

  @Column()
  createdUserId: number;

  @CreateDateColumn()
  createdDatetime: Date;

  @Column({ nullable: true })
  modifiedUserId?: number;

  @UpdateDateColumn({ nullable: true })
  modifiedDatetime?: Date;
}
