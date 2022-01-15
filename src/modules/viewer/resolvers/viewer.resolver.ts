import { UseGuards } from '@nestjs/common';
import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAuthGuard } from '~/modules/auth/guards';
import { UserContext } from '~/modules/core';
import { Permission, Viewer } from '../objects';
import { PermissionService } from '../services';

@UseGuards(GraphQlAuthGuard)
@Resolver(() => Viewer)
export class ViewerResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => Viewer)
  public viewer() {
    return {};
  }

  @ResolveField('permissions', () => Permission)
  public companyAction(@CurrentUser() user: UserContext): Permission {
    return this.permissionService.compute(user);
  }
}
