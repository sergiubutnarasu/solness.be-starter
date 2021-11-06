import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/modules/core';
import { User } from '~/modules/user';
import { CompanyRole } from '../enums';
import { Company } from './company.entity';

@Entity('companyUsers')
export class CompanyUser extends BaseEntity {
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: false })
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'enum', enum: CompanyRole, default: CompanyRole.User })
  role: CompanyRole;
}
