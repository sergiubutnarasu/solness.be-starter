import { MigrationInterface, QueryRunner } from 'typeorm';
import { Company, CompanyUser } from '~/modules/company/objects';
import {
  AppConfigKey,
  AppHelper,
  CompanyRole,
  CryptoHelper,
  Role,
} from '~/modules/core';
import { User } from '../modules/user/objects';

export class DefaultSetup1567498401541 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const password = CryptoHelper.hash(
      AppHelper.getConfig(AppConfigKey.DefaultUserPassword),
    );

    const {
      raw: { insertId: userId },
    } = await queryRunner.manager.insert<User>('user', {
      enabled: true,
      verified: true,
      createdUserId: 0,
      createdDatetime: new Date(),
      email: AppHelper.getConfig(AppConfigKey.DefaultUsername),
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.Admin,
    });

    const {
      raw: { insertId: companyId },
    } = await queryRunner.manager.insert<Company>('company', {
      enabled: true,
      createdUserId: 0,
      createdDatetime: new Date(),
      name: 'Solness',
      email: AppHelper.getConfig(AppConfigKey.DefaultUsername),
      phone: 'Phone number',
      registerNumber: 'CUI',
    });

    await queryRunner.manager.insert<CompanyUser>('companyUser', {
      enabled: true,
      verified: true,
      createdUserId: 0,
      createdDatetime: new Date(),
      userId,
      companyId,
      roles: [CompanyRole.Owner],
    });
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.delete<User>('user', {
      email: AppHelper.getConfig(AppConfigKey.DefaultUsername),
    });
  }
}
