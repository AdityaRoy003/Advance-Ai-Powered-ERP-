import userRepository from './user.repository.js';

class UserService {
  public async getUserByEmail(email: string) {
    return userRepository.findUserByEmail(email);
  }

  public async createUser(data: Record<string, unknown>) {
    return userRepository.createUser(data);
  }
}

export default new UserService();
