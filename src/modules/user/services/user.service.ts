import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import {
  BaseService,
  CryptoHelper,
  Role,
  StringHelper,
  UserContext,
} from '~/modules/core';
import { EmailService, MailDataRequired } from '~/modules/email';
import { User } from '../objects';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService extends BaseService<User> {
  protected addAccessCondition(
    query: SelectQueryBuilder<User>,
    user: UserContext,
  ): SelectQueryBuilder<User> {
    if (user.role === Role.Admin) {
      return query;
    }

    return query
      .innerJoin('companyUsers', 'COMPANIES', 'GENERIC.id = COMPANIES.userId')
      .andWhere('COMPANIES.companyId = :companyId', {
        companyId: user.data.companyId,
      });
  }

  constructor(
    protected readonly repo: UserRepository,
    protected readonly emailService: EmailService,
  ) {
    super(repo);
  }

  public async create(model: User, user: UserContext): Promise<User> {
    const password = StringHelper.generateString(6, 12);
    model.password = CryptoHelper.hash(password);
    const result = await super.create(model, user);

    await this.sendPasswordEmail(model, password);
    return result;
  }

  private async sendPasswordEmail(model: User, password: string) {
    const mail: MailDataRequired = {
      subject: 'Core account',
      to: model.email,
      from: undefined,
      text: `${model.email} - ${password}`,
    };

    await this.emailService.sendEmail(mail);
  }

  public async changePassword(
    userId: number,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.repo.findOne(userId);

    if (user) {
      user.password = CryptoHelper.hash(newPassword);
      this.repo.save(user);
      return true;
    }

    return false;
  }

  public async getUserByEmail(email: string): Promise<User> {
    return await this.findOne({
      email: email,
      enabled: true,
    });
  }

  public async getUserAuthPayload(userId: number): Promise<UserContext> {
    const context = await this.repo.getUserAuthPayload(userId);

    return context;
  }
}
