import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, CompanyRole } from '~/modules/core';
import { User } from '~/modules/user';
import { Company } from './company.entity';

@Entity('companyUsers')
@ObjectType()
@InputType({ isAbstract: true })
export class CompanyUser extends BaseEntity {
  @Column()
  @Field()
  verified: boolean;

  @Field()
  @Column({ nullable: false })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  user?: User;

  @Field()
  @Column({ nullable: false })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.users)
  company?: Company;

  @Field(() => [String])
  @Column({
    type: 'set',
    enum: CompanyRole,
    default: [CompanyRole.User],
  })
  roles: CompanyRole[];
}
