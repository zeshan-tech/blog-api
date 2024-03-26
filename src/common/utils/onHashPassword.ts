import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const onHashPassword = async (password: string): Promise<string> => {
  // Generate a salt and hash the password using bcrypt
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);

  // Return the hashed password
  return hash;
};
