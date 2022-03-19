import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  AppConfigKey,
  AppHelper,
  CompanyRole,
  CryptoHelper,
  Role,
} from '~/core';
import { Company, CompanyUser } from '~/modules/company/objects';
import { User } from '~/shared/user';

export class DefaultSetup1567498401541 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const password = CryptoHelper.hash(
      AppHelper.getConfig(AppConfigKey.DefaultUserPassword),
    );

    const {
      identifiers: [{ id: userId }],
    } = await queryRunner.manager.insert<User>('user', {
      enabled: true,
      verified: true,
      createdUserId: 0,
      createdDatetime: new Date(),
      email: AppHelper.getConfig(AppConfigKey.DefaultUsername),
      password,
      firstName: 'Sergiu',
      lastName: 'Butnarasu',
      title: 'Fullstack Developer',
      role: Role.Admin,
    });

    const {
      identifiers: [{ id: companyId }],
    } = await queryRunner.manager.insert<Company>('company', {
      enabled: true,
      createdUserId: 0,
      createdDatetime: new Date(),
      name: 'Solness',
      email: AppHelper.getConfig(AppConfigKey.DefaultUsername),
      phone: '+123456789',
      registerNumber: 'RO123456',
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
