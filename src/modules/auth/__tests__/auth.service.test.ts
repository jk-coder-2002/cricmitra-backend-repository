import { authService } from '../auth.service';
import { userRepository } from '../../user/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../user/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw an error for invalid email', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(authService.login({ email: 'test@test.com', password: 'password' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('should return tokens for valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@test.com',
        passwordHash: 'hashed_password',
        name: 'Test User'
      };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

      const result = await authService.login({ email: 'test@test.com', password: 'password' });
      expect(result.accessToken).toBe('mocked_token');
      expect(result.user.id).toBe('user123');
    });
  });
});
