import { Module } from '@nestjs/common';
import { ViewerResolver } from './resolvers';
import { PermissionService } from './services';

@Module({ providers: [ViewerResolver, PermissionService] })
export class ViewerModule {}
