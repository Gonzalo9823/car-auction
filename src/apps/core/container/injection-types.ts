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
  AddVehicleToFavorites: Symbol.for('AddVehicleToFavorites'),
  VehicleDBRepository: Symbol.for('VehicleDBRepository'),
};
