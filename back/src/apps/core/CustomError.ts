export enum ErrorType {
  NotFound = 'NOT_FOUND',
  Validation = 'VALIDATION',
  BadRequest = 'BAD_REQUEST',
  MethodNotAllowed = 'METHOD_NOT_ALLOWED',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  Unauthorized = 'UNAUTHORIZED',
}

export enum ErrorCode {
  DataNotFound = 'DATA_NOT_FOUND',
  InvalidData = 'INVALID_DATA',
  ConstraintError = 'CONSTRAINT_ERROR',
  CantTransformInfrastructureToDomain = 'CANT_TRANSFORM_INFRASTRUCTURE_TO_DOMAIN',
  IncorrectPassword = 'INCORRECT_PASSWORD',
  EmailOrPasswordIncorrect = 'EMAIL_OR_PASSWORD_INCORRECT',
  ExpiredToken = 'EXPIRED_TOKEN',
  InvalidToken = 'INVALID_TOKEN',
  NoTokenSent = 'NOT_TOKEN_SEND',
  UserDoesNotHaveGrant = 'USER_DOES_NOT_HAVE_GRANT',
  CantAddOwnVehicleToFavorites = 'CANT_ADD_OWN_VEHICLE_TO_FAVORITES',
  VehicleAlreadySold = 'VEHICLE_ALREADY_SOLD',
  VehicleHasActivePublication = 'VEHICLE_HAS_ACTIVE_PUBLICATION',
  PublicationHasEnded = 'PUBLICATION_HAS_ENDED',
  CantBidOnOwnPublication = 'CANT_BID_ON_OWN_PUBLICATION',
  BidSmallerThanBiggest = 'BID_SMALLER_THAN_BIGGEST',
}

export enum ContextErrorType {
  AlreadyExists = 'ALREADY_EXISTS',
  InvalidData = 'INVALID_DATA',
  InvalidState = 'INVALID_STATE',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  UniqueProperty = 'UNIQUE_PROPERTY',
  Transformer = 'TRANSFORMER',
  Grant = 'GRANT',
}

export class CustomError extends Error {
  private readonly _type: ErrorType;
  private readonly _context: { path?: string; type?: ContextErrorType }[];

  constructor(_type: ErrorType, code: ErrorCode, _context?: { path?: string; type?: ContextErrorType }[]) {
    super();
    this._type = _type;
    this.message = code;
    this._context = _context || [];
  }

  get type() {
    return this._type;
  }

  get context() {
    return this._context;
  }

  public addToContext(_context: { path?: string; type?: ContextErrorType }) {
    this._context.push(_context);
  }
}
