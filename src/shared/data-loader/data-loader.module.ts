import { Module } from '@nestjs/common';
import { SharedUserModule } from '../user';
import { DataLoaderService, UsersLoader } from './services';

@Module({
  imports: [SharedUserModule],
  providers: [DataLoaderService, UsersLoader],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
