export const TYPES = {
  // Role
  GetRoleById: Symbol.for('GetRoleById'),
  GetRoleByName: Symbol.for('GetRoleByName'),
  RoleDBRepository: Symbol.for('RoleDBRepository'),

  // Auth
  SignUp: Symbol.for('SignUp'),
  AddRefreshToken: Symbol.for('AddRefreshToken'),
  RemoveRefreshToken: Symbol.for('RemoveRefreshToken'),
  SignIn: Symbol.for('SignIn'),
  GetAuthUserById: Symbol.for('GetAuthUserById'),
  Refresh: Symbol.for('Refresh'),
  CheckRefreshToken: Symbol.for('CheckRefreshToken'),
  SignOut: Symbol.for('SignOut'),
  AuthUserDBRepository: Symbol.for('AuthUserDBRepository'),

  // Me
  GetMeById: Symbol.for('GetMeById'),
  UpdateMyData: Symbol.for('UpdateMyData'),
  UpdateMyPassword: Symbol.for('UpdateMyPassword'),
  MeDBRepository: Symbol.for('MeDBRepository'),

  // Grant
  CheckGrantByRoleId: Symbol.for('CheckGrantByRoleId'),
  GrantDBRepository: Symbol.for('GrantDBRepository'),

  // Vehicle
  CreateVehicle: Symbol.for('CreateVehicle'),
  GetVehicles: Symbol.for('GetVehicles'),
  GetVehicleById: Symbol.for('GetVehicleById'),
  GetMyVehicles: Symbol.for('GetMyVehicles'),
  GetMyVehicle: Symbol.for('GetMyVehicle'),
  AddVehicleToFavorites: Symbol.for('AddVehicleToFavorites'),
  GetFavoriteVehicles: Symbol.for('GetFavoriteVehicles'),
  VehicleDBRepository: Symbol.for('VehicleDBRepository'),

  // Publication
  CreatePublication: Symbol.for('CreatePublication'),
  GetPublicationsByVehicleId: Symbol.for('GetPublicationsByVehicleId'),
  VehicleHasActivePublication: Symbol.for('VehicleHasActivePublication'),
  GetPublications: Symbol.for('GetPublications'),
  GetPublicationById: Symbol.for('GetPublicationById'),
  GetMyPublications: Symbol.for('GetMyPublications'),
  GetBiddedPublications: Symbol.for('GetBiddedPublications'),
  PublicationDBRepository: Symbol.for('PublicationDBRepository'),

  // Bid
  GetBiggestBidByPublicationId: Symbol.for('GetBiggestBidByPublicationId'),
  CreateBid: Symbol.for('CreateBid'),
  GetMyBids: Symbol.for('GetMyBids'),
  BidDBRepository: Symbol.for('BidDBRepository'),
};
