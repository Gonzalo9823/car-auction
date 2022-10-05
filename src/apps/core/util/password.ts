import { compare, hash } from 'bcrypt';

import { CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';

import config from '@/config';

export const checkPassword = async (password: string, encryptedPassword: string, messageOnlyPassword = false): Promise<void> => {
  const hashedPassword = `${password}+${config.PASSWORD_SALT}`;
  const match = await compare(hashedPassword, encryptedPassword);

  if (!match) {
    if (messageOnlyPassword) {
      throw new CustomError(ErrorType.Validation, ErrorCode.IncorrectPassword);
    }

    throw new CustomError(ErrorType.NotFound, ErrorCode.EmailOrPasswordIncorrect);
  }
};

export const encryptPassword = async (password: string): Promise<string> => {
  const hashedPassword = `${password}+${config.PASSWORD_SALT}`;
  return hash(hashedPassword, 10);
};
