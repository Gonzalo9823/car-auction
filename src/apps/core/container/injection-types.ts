export const TYPES = {
  // Role
  GetRoleById: Symbol.for('GetRoleById'),
  GetRoleByName: Symbol.for('GetRoleByName'),
  RoleDBRepository: Symbol.for('RoleDBRepository'),

  // Auth
  SignUp: Symbol.for('SignUp'),
  AddRefreshToken: Symbol.for('AddRefreshToken'),
  SignIn: Symbol.for('SignIn'),
  AuthUserDBRepository: Symbol.for('AuthUserDBRepository'),

  // Me
  GetMeById: Symbol.for('GetMeById'),
  MeDBRepository: Symbol.for('MeDBRepository'),
};
