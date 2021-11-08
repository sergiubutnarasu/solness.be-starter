import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/modules/core';
import { User } from '~/modules/user';
import { CompanyRole } from '../enums';
import { Company } from './company.entity';

@Entity('companyUsers')
@ObjectType()
@InputType({ isAbstract: true })
export class CompanyUser extends BaseEntity {
  @Field()
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User)
  user?: User;

  @Field()
  @Column({ nullable: false })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.users)
  company?: Company;

  @Field()
  @Column({ type: 'enum', enum: CompanyRole, default: CompanyRole.User })
  role: CompanyRole;
}