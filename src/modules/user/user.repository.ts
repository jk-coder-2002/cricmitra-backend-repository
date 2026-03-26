import { User, IUser } from './user.schema';
import { UserRole } from './user.role.schema';
import { Role } from '../role/role.schema';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async assignRole(userId: string, roleId: string) {
    return UserRole.create({ userId, roleId });
  }

  async getUserRoles(userId: string) {
    return UserRole.find({ userId }).populate('roleId').exec();
  }
}

export const userRepository = new UserRepository();
