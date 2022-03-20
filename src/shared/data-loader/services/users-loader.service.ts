import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { SharedUserService, User } from '~/shared/user';

@Injectable()
export class UsersLoader {
  constructor(private readonly sharedUserService: SharedUserService) {}

  public get() {
    return new DataLoader<number, User>(async (keys: number[]) => {
      const users = await this.sharedUserService.getByIdsWithoutGuard(keys);

      const map = new Map(users.map((user) => [user.id, user]));
      return keys.map((key) => map.get(key));
    });
  }
}
