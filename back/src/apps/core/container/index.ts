import 'reflect-metadata';

import { Container } from 'inversify';

import { AddRefreshToken } from 'apps/auth/application/add-refresh-token';
import { CheckRefreshToken } from 'apps/auth/application/check-refresh-token';
import { GetAuthUserById } from 'apps/auth/application/get-auth-user-by-id';
import { Refresh } from 'apps/auth/application/refresh';
import { RemoveRefreshToken } from 'apps/auth/application/remove-refresh-token';
import { SignIn } from 'apps/auth/application/sign-in';
import { SignOut } from 'apps/auth/application/sign-out';
import { SignUp } from 'apps/auth/application/sign-up';
import { AuthUserDBRepository } from 'apps/auth/domain/auth-user-db-repository';
import { AuthUserTypeORMRepository } from 'apps/auth/infrastructure/auth-user-typeorm-repository';
import { CreateBid } from 'apps/bid/application/create-bid';
import { GetBiggestBidByPublicationId } from 'apps/bid/application/get-biggest-bid-by-publication-id';
import { GetMyBids } from 'apps/bid/application/get-my-bids';
import { BidDBRepository } from 'apps/bid/domain/bid-db-repository';
import { BidTypeORMRepository } from 'apps/bid/infrastructure/bid-type-orm-repository';
import { CheckGrantByRoleId } from 'apps/core/application/check-grant-by-role-id';
import { TYPES } from 'apps/core/container/injection-types';
import { GrantDBRepository } from 'apps/core/domain/grant-db-repository';
import { GrantTypeORMRepository } from 'apps/core/infrastructure/grant-type-orm-repository';
import { GetMeById } from 'apps/me/application/get-me-by-id';
import { UpdateMyData } from 'apps/me/application/update-my-data';
import { UpdateMyPassword } from 'apps/me/application/update-my-password';
import { MeDBRepository } from 'apps/me/domain/me-db-repository';
import { MeTypeORMRepository } from 'apps/me/infrastructure/me-type-orm-repository';
import { CreatePublication } from 'apps/publication/application/create-publication';
import { GetBiddedPublications } from 'apps/publication/application/get-bidded-publications';
import { GetMyPublications } from 'apps/publication/application/get-my-publications';
import { GetPublicationById } from 'apps/publication/application/get-publication-by-id';
import { GetPublications } from 'apps/publication/application/get-publications';
import { GetPublicationsByVehicleId } from 'apps/publication/application/get-publications-by-vehicle-id';
import { VehicleHasActivePublication } from 'apps/publication/application/vehicle-has-active-publication';
import { PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';
import { PublicationTypeORMRepository } from 'apps/publication/infrastructure/publication-type-orm-repository';
import { GetRoleById } from 'apps/role/application/get-role-by-id';
import { GetRoleByName } from 'apps/role/application/get-role-by-name';
import { RoleDBRepository } from 'apps/role/domain/role-db-repository';
import { RoleTypeORMRepository } from 'apps/role/infrastructure/role-type-orm-repository';
import { AddVehicleToFavorites } from 'apps/vehicle/application/add-vehicle-to-favorites';
import { CreateVehicle } from 'apps/vehicle/application/create-vehicle';
import { GetFavoriteVehicles } from 'apps/vehicle/application/get-favorites-vehicles';
import { GetMyVehicle } from 'apps/vehicle/application/get-my-vehicle';
import { GetMyVehicles } from 'apps/vehicle/application/get-my-vehicles';
import { GetVehicleById } from 'apps/vehicle/application/get-vehicle-by-id';
import { GetVehicles } from 'apps/vehicle/application/get-vehicles';
import { VehicleSearchRepository } from 'apps/vehicle/domain/vehicle-search-repository';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';
import { VehicleOpenSearchRepository } from 'apps/vehicle/infrastructure/vehicle-open-search-repository';
import { VehicleTypeORMRepository } from 'apps/vehicle/infrastructure/vehicle-type-orm-repository';

const container = new Container({});

// Role
container.bind<GetRoleById>(TYPES.GetRoleById).to(GetRoleById);
container.bind<GetRoleByName>(TYPES.GetRoleByName).to(GetRoleByName);
container.bind<RoleDBRepository>(TYPES.RoleDBRepository).to(RoleTypeORMRepository);

// Auth
container.bind<SignUp>(TYPES.SignUp).to(SignUp);
container.bind<AddRefreshToken>(TYPES.AddRefreshToken).to(AddRefreshToken);
container.bind<RemoveRefreshToken>(TYPES.RemoveRefreshToken).to(RemoveRefreshToken);
container.bind<SignIn>(TYPES.SignIn).to(SignIn);
container.bind<GetAuthUserById>(TYPES.GetAuthUserById).to(GetAuthUserById);
container.bind<Refresh>(TYPES.Refresh).to(Refresh);
container.bind<CheckRefreshToken>(TYPES.CheckRefreshToken).to(CheckRefreshToken);
container.bind<SignOut>(TYPES.SignOut).to(SignOut);
container.bind<AuthUserDBRepository>(TYPES.AuthUserDBRepository).to(AuthUserTypeORMRepository);

// Me
container.bind<GetMeById>(TYPES.GetMeById).to(GetMeById);
container.bind<UpdateMyData>(TYPES.UpdateMyData).to(UpdateMyData);
container.bind<UpdateMyPassword>(TYPES.UpdateMyPassword).to(UpdateMyPassword);
container.bind<MeDBRepository>(TYPES.MeDBRepository).to(MeTypeORMRepository);

// Grant
container.bind<CheckGrantByRoleId>(TYPES.CheckGrantByRoleId).to(CheckGrantByRoleId);
container.bind<GrantDBRepository>(TYPES.GrantDBRepository).to(GrantTypeORMRepository);

// Vehicle
container.bind<CreateVehicle>(TYPES.CreateVehicle).to(CreateVehicle);
container.bind<GetVehicles>(TYPES.GetVehicles).to(GetVehicles);
container.bind<GetVehicleById>(TYPES.GetVehicleById).to(GetVehicleById);
container.bind<GetMyVehicles>(TYPES.GetMyVehicles).to(GetMyVehicles);
container.bind<GetMyVehicle>(TYPES.GetMyVehicle).to(GetMyVehicle);
container.bind<AddVehicleToFavorites>(TYPES.AddVehicleToFavorites).to(AddVehicleToFavorites);
container.bind<GetFavoriteVehicles>(TYPES.GetFavoriteVehicles).to(GetFavoriteVehicles);
container.bind<VehicleDBRepository>(TYPES.VehicleDBRepository).to(VehicleTypeORMRepository);
container.bind<VehicleSearchRepository>(TYPES.VehicleSearchRepository).to(VehicleOpenSearchRepository);

// Publication
container.bind<CreatePublication>(TYPES.CreatePublication).to(CreatePublication);
container.bind<GetPublicationsByVehicleId>(TYPES.GetPublicationsByVehicleId).to(GetPublicationsByVehicleId);
container.bind<VehicleHasActivePublication>(TYPES.VehicleHasActivePublication).to(VehicleHasActivePublication);
container.bind<GetPublications>(TYPES.GetPublications).to(GetPublications);
container.bind<GetPublicationById>(TYPES.GetPublicationById).to(GetPublicationById);
container.bind<GetMyPublications>(TYPES.GetMyPublications).to(GetMyPublications);
container.bind<GetBiddedPublications>(TYPES.GetBiddedPublications).to(GetBiddedPublications);
container.bind<PublicationDBRepository>(TYPES.PublicationDBRepository).to(PublicationTypeORMRepository);

// Bid
container.bind<GetBiggestBidByPublicationId>(TYPES.GetBiggestBidByPublicationId).to(GetBiggestBidByPublicationId);
container.bind<CreateBid>(TYPES.CreateBid).to(CreateBid);
container.bind<GetMyBids>(TYPES.GetMyBids).to(GetMyBids);
container.bind<BidDBRepository>(TYPES.BidDBRepository).to(BidTypeORMRepository);

export { container };
