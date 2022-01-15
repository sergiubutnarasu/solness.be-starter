import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import {
  BaseService,
  CryptoHelper,
  Role,
  StringHelper,
  UserContext,
} from '~/modules/core';
import { UserService } from '~/modules/user';
import { CompanyUser, InviteUserInput } from '../objects';
import { CompanyUserRepository } from '../repositories';

@Injectable()
export class CompanyUserService extends BaseService<CompanyUser> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CompanyUser>,
    user: UserContext,
  ): SelectQueryBuilder<CompanyUser> {
    if (user.role === Role.Admin) {
      return query;
    }

    return query.andWhere('GENERIC.id.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  constructor(
    protected readonly repo: CompanyUserRepository,
    private readonly userService: UserService,
  ) {
    super(repo);
  }

  public async inviteUser(
    invited: InviteUserInput,
    user: UserContext,
  ): Promise<CompanyUser | undefined> {
    const existingUser = await this.userService.getUserByEmail(invited.email);

    if (existingUser) {
      return await this.inviteExistingUser(existingUser.id, user);
    }

    return await this.inviteNewUser(invited, user);
  }

  public async excludeUser(userId: number, user: UserContext) {
    await this.repo.excludeUser(userId, user);
  }

  private async inviteExistingUser(
    userId: number,
    user: UserContext,
  ): Promise<CompanyUser | undefined> {
    const exitingCompanyUser = await this.repo.getByUserId(userId, user);

    if (exitingCompanyUser) {
      // TODO - send invite email

      return exitingCompanyUser;
    }

    // TODO - send invite email

    return await this.create(
      {
        userId: userId,
        companyId: +user.data.companyId,
        enabled: true,
        verified: false,
      },
      user,
    );
  }

  private async inviteNewUser(invited: InviteUserInput, user: UserContext) {
    const randomString = StringHelper.generateString(6, 12);
    const password = CryptoHelper.hash(randomString);

    const newCompanyUser = await this.userService.create(
      {
        ...invited,
        password,
        enabled: true,
        verified: false,
      },
      user,
    );

    if (!newCompanyUser) {
      return;
    }

    // TODO - send invite email

    return await this.create(
      {
        userId: newCompanyUser.id,
        companyId: +user.data.companyId,
        enabled: true,
        verified: false,
      },
      user,
    );
  }
}
