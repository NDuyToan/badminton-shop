import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  saltRounds = 10,
): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string | null | undefined,
): Promise<boolean> => {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
};
