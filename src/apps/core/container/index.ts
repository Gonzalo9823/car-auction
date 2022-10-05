import 'reflect-metadata';

import { Container } from 'inversify';

import { AddRefreshToken } from 'apps/auth/application/add-refresh-token';
import { SignIn } from 'apps/auth/application/sign-in';
import { SignUp } from 'apps/auth/application/sign-up';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { AuthUserTypeORMRepository } from 'apps/auth/infrastructure/auth-user-typeorm-repository';
import { CheckGrantByRoleId } from 'apps/core/application/check-grant-by-role-id';
import { TYPES } from 'apps/core/container/injection-types';
import { GrantDBRepository } from 'apps/core/domain/grant-db-repository';
import { GrantTypeORMRepository } from 'apps/core/infrastructure/grant-type-orm-repository';
import { GetMeById } from 'apps/me/application/get-me-by-id';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';
import { MeTypeORMRepository } from 'apps/me/infrastructure/me-type-orm-repository';
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

// Me
container.bind<GetMeById>(TYPES.GetMeById).to(GetMeById);
container.bind<MeDBRepository>(TYPES.MeDBRepository).to(MeTypeORMRepository);

// Grant
container.bind<CheckGrantByRoleId>(TYPES.CheckGrantByRoleId).to(CheckGrantByRoleId);
container.bind<GrantDBRepository>(TYPES.GrantDBRepository).to(GrantTypeORMRepository);

export { container };
