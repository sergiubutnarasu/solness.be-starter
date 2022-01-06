import { Module } from '@nestjs/common';
import { ViewerResolver } from './resolvers';
import { PermissionService, UserActionService } from './services';

@Module({ providers: [ViewerResolver, PermissionService, UserActionService] })
export class ViewerModule {}
