import UserModel from './user.model.js';

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email }).exec();
};

export const createUser = async (data: Record<string, unknown>) => {
  return UserModel.create(data);
};

export default { findUserByEmail, createUser };
