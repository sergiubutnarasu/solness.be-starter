import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import {
  BaseService,
  CryptoHelper,
  Role,
  StringHelper,
  UserContext,
} from '~/core';
import { EmailService, MailDataRequired } from '~/modules/email';
import { User } from '../objects';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService extends BaseService<User> {
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
    oldPassword: string,
    newPassword: string,
    user: UserContext,
  ): Promise<boolean> {
    const existingUser = await this.repo.findOne({
      where: { id: user.id },
      select: ['id', 'password'],
    });

    if (
      existingUser &&
      CryptoHelper.compare(oldPassword, existingUser.password)
    ) {
      existingUser.password = CryptoHelper.hash(newPassword);
      this.repo.save(existingUser);
      return true;
    }

    return false;
  }

  public async resetPassword(userId: number, newPassword: string) {
    const existingUser = await this.repo.findOne({
      where: { id: userId },
      select: ['id'],
    });

    if (existingUser) {
      existingUser.password = CryptoHelper.hash(newPassword);
      await this.repo.save(existingUser);

      return true;
    }

    return false;
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
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
