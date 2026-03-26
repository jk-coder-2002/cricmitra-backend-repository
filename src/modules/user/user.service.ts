import { userRepository } from './user.repository';
import { AppError } from '../../common/errors/AppError';

export class UserService {
  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const roles = await userRepository.getUserRoles(userId);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      roles: roles.map(r => (r.roleId as any).name)
    };
  }
}

export const userService = new UserService();
