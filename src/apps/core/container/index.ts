import 'reflect-metadata';

import { Container } from 'inversify';

import { AddRefreshToken } from 'apps/auth/application/add-refresh-token';
import { SignIn } from 'apps/auth/application/sign-in';
import { SignUp } from 'apps/auth/application/sign-up';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { AuthUserTypeORMRepository } from 'apps/auth/infrastructure/auth-user-typeorm-repository';
import { TYPES } from 'apps/core/container/injection-types';
import { GetRoleById } from 'apps/role/application/get-role-by-id';
import { GetRoleByName } from 'apps/role/application/get-role-by-name';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';
import { RoleTypeORMRepository } from 'apps/role/infrastructure/role-type-orm-repository';

const container = new Container({});

// Role
container.bind<GetRoleById>(TYPES.GetRoleById).to(GetRoleById);
container.bind<GetRoleByName>(TYPES.GetRoleByName).to(GetRoleByName);
container.bind<RoleDBRepository>(TYPES.RoleDBRepository).to(RoleTypeORMRepository);

// Auth
container.bind<SignUp>(TYPES.SignUp).to(SignUp);
container.bind<AddRefreshToken>(TYPES.AddRefreshToken).to(AddRefreshToken);
container.bind<SignIn>(TYPES.SignIn).to(SignIn);
container.bind<AuthUserDBRepository>(TYPES.AuthUserDBRepository).to(AuthUserTypeORMRepository);

export { container };
