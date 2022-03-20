import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { SharedUserService, User } from '~/shared/user';
import { UsersLoader } from './users-loader.service';

@Injectable()
export class DataLoaderService {
  constructor(private readonly usersLoader: UsersLoader) {}

  public createLoaders() {
    const usersLoader = this.usersLoader.get();

    return { usersLoader };
  }
}
