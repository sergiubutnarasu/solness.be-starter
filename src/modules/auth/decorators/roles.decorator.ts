import { SetMetadata } from '@nestjs/common';
import { Role } from '~/modules/core';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
