import { SetMetadata } from '@nestjs/common';
import { Role } from '~/core';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
