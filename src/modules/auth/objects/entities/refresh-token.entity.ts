import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/modules/core';

@Entity('refreshToken')
export class RefreshToken extends BaseEntity {
  @Column()
  userId: number;

  @ManyToOne('User', { nullable: false })
  user?: unknown;

  @Column({ length: 250 })
  token: string;

  @Column()
  expireDate: Date;
}
