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
import { UpdateMyData } from 'apps/me/application/update-my-data';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';
import { MeTypeORMRepository } from 'apps/me/infrastructure/me-type-orm-repository';
import { GetRoleById } from 'apps/role/application/get-role-by-id';
import { GetRoleByName } from 'apps/role/application/get-role-by-name';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';
import { RoleTypeORMRepository } from 'apps/role/infrastructure/role-type-orm-repository';
import { AddVehicleToFavorites } from 'apps/vehicle/application/add-vehicle-to-favorites';
import { CreateVehicle } from 'apps/vehicle/application/create-vehicle';
import { GetMyVehicles } from 'apps/vehicle/application/get-my-vehicles';
import { GetVehicleById } from 'apps/vehicle/application/get-vehicle-by-id';
import { GetVehicles } from 'apps/vehicle/application/get-vehicles';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';
import { VehicleTypeORMRepository } from 'apps/vehicle/infrastructure/vehicle-type-orm-repository';

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
container.bind<UpdateMyData>(TYPES.UpdateMyData).to(UpdateMyData);
container.bind<MeDBRepository>(TYPES.MeDBRepository).to(MeTypeORMRepository);

// Grant
container.bind<CheckGrantByRoleId>(TYPES.CheckGrantByRoleId).to(CheckGrantByRoleId);
container.bind<GrantDBRepository>(TYPES.GrantDBRepository).to(GrantTypeORMRepository);

// Vehicle
container.bind<CreateVehicle>(TYPES.CreateVehicle).to(CreateVehicle);
container.bind<GetVehicles>(TYPES.GetVehicles).to(GetVehicles);
container.bind<GetVehicleById>(TYPES.GetVehicleById).to(GetVehicleById);
container.bind<GetMyVehicles>(TYPES.GetMyVehicles).to(GetMyVehicles);
container.bind<AddVehicleToFavorites>(TYPES.AddVehicleToFavorites).to(AddVehicleToFavorites);
container.bind<VehicleDBRepository>(TYPES.VehicleDBRepository).to(VehicleTypeORMRepository);

export { container };
