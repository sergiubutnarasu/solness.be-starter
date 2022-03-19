import { Injectable } from '@nestjs/common';
import { BaseService, CryptoHelper, UserContext } from '~/core';
import { User } from '~/shared/user';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(protected readonly repo: UserRepository) {
    super(repo);
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
}
