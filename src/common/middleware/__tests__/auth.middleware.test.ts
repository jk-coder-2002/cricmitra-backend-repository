import { requireRole, requirePermission } from '../auth.middleware';
import { AppError } from '../../errors/AppError';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('requireRole', () => {
    it('should pass if user has the required role', () => {
      mockRequest = { user: { userId: '1', roles: ['Admin'], permissions: [] } } as any;
      const middleware = requireRole(['Admin']);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should throw AppError if user does not have role', () => {
      mockRequest = { user: { userId: '1', roles: ['Viewer'], permissions: [] } } as any;
      const middleware = requireRole(['Admin']);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('requirePermission', () => {
    it('should pass if user has the required permission', () => {
      mockRequest = { user: { userId: '1', roles: ['Scorer'], permissions: ['update_score'] } } as any;
      const middleware = requirePermission(['update_score']);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should throw AppError if user lacks permission', () => {
      mockRequest = { user: { userId: '1', roles: ['Viewer'], permissions: [] } } as any;
      const middleware = requirePermission(['update_score']);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should pass if user is SuperAdmin despite missing exact permission string', () => {
      mockRequest = { user: { userId: '1', roles: ['SuperAdmin'], permissions: [] } } as any;
      const middleware = requirePermission(['update_score']);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith();
    });
  });
});
