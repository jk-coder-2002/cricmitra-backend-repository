import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../user/user.repository';
import { Role } from '../role/role.schema';
import config from '../../config';
import { AppError } from '../../common/errors/AppError';

export class AuthService {
  async register(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name,
      phone: data.phone
    });

    let defaultRole = await Role.findOne({ name: 'Player' }).exec();
    if (!defaultRole) {
       defaultRole = await Role.create({ name: 'Player' });
    }

    await userRepository.assignRole(user._id as unknown as string, defaultRole._id as unknown as string);

    return { message: 'Registration successful' };
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
  }
}

export const authService = new AuthService();
