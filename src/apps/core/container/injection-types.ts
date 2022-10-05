export const TYPES = {
  // Role
  GetRoleById: Symbol.for('GetRoleById'),
  GetRoleByName: Symbol.for('GetRoleByName'),
  RoleDBRepository: Symbol.for('RoleDBRepository'),

  // Auth
  SignUp: Symbol.for('SignUp'),
  AddRefreshToken: Symbol.for('AddRefreshToken'),
  AuthUserDBRepository: Symbol.for('AuthUserDBRepository'),
};
