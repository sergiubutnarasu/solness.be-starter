import { EntityRepository } from 'typeorm';
import {
  BaseRepository,
  CryptoHelper,
  Role,
  UserContext,
} from '~/modules/core';
import { User } from '../objects';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  public async getUserAuthPayload(userId: number): Promise<UserContext> {
    const result = await this.query(
      `
        SELECT 
          USER.id,
          USER.email,
          USER.role,
          USER.firstName,
          USER.lastName,
          COMPANY_USER.companyId,
          COMPANY_USER.roles as companyRoles
        FROM user USER
        LEFT JOIN companyUser COMPANY_USER
          ON COMPANY_USER.userId = USER.id
        WHERE
          USER.id = ?
            AND USER.enabled = 1
            AND USER.verified = 1
      `,
      [userId],
    );

    if (!result?.length) {
      return null;
    }

    const data = result[0];
    const isAdmin = data.role === Role.Admin;

    const context = {
      email: CryptoHelper.decryptValue(data.email),
      id: data.id,
      role: data.role,
      data: {
        isAdmin,
        companyId: data.companyId,
        companyRoles: ((data.companyRoles as string) ?? '').split(','),
        firstName: CryptoHelper.decryptValue(data.firstName),
        lastName: CryptoHelper.decryptValue(data.lastName),
      },
    };

    return context;
  }
}
