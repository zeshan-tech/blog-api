import * as bcrypt from 'bcrypt';

export const onHashPassword = async (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync(8, 'b');
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const onComparePassword = (hashedPassword: string, password: string): boolean => {
  const isMatched = bcrypt.compareSync(password, hashedPassword);
  return isMatched;
};
