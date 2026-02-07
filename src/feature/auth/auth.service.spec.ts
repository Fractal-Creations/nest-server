import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.model';
import { RefreshToken } from './refresh-token.model';
import { PinCodeJournal } from './pin-code-journal.model';

describe('AuthService', () => {
  let service: AuthService;
  let mockRefreshTokenModel: any;
  let mockPinCodeJournalModel: any;
  let mockUserService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockRefreshTokenModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn(),
    };

    mockPinCodeJournalModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockUserService = {
      getUsersByPhone: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(RefreshToken),
          useValue: mockRefreshTokenModel,
        },
        {
          provide: getModelToken(PinCodeJournal),
          useValue: mockPinCodeJournalModel,
        },
        {
          provide: 'UsersService',
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAndStoreRefreshToken', () => {
    it('should create and return a refresh token', async () => {
      const userId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      const mockToken = {
        id: 1,
        userId: userId,
        token: 'mock-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      mockRefreshTokenModel.create.mockResolvedValue(mockToken);

      const result = await service.generateAndStoreRefreshToken(userId);

      expect(result).toEqual(mockToken);
      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith({
        userId: userId,
        token: expect.any(String),
        expiresAt: expect.any(Date),
      });
    });
  });

  describe('validateRefreshToken', () => {
    it('should return user if refresh token is valid and not expired', async () => {
      const mockToken = 'valid-token';
      const mockUser = { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', phone: '+79990001122', toJSON: () => ({ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', phone: '+79990001122' }) } as unknown as User;
      const mockRefreshToken = {
        token: mockToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        user: mockUser,
      };

      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshToken);

      const result = await service.validateRefreshToken(mockToken);

      expect(result).toEqual(mockUser);
      expect(mockRefreshTokenModel.findOne).toHaveBeenCalledWith({
        where: { token: mockToken },
        include: [{ model: User }],
      });
    });

    it('should throw UnauthorizedException if refresh token does not exist', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      await expect(service.validateRefreshToken('invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException and revoke token if refresh token is expired', async () => {
      const mockToken = 'expired-token';
      const mockRefreshToken = {
        token: mockToken,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        user: null,
      };

      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshToken);

      await expect(service.validateRefreshToken(mockToken))
        .rejects.toThrow(UnauthorizedException);
        
      expect(mockRefreshTokenModel.destroy).toHaveBeenCalledWith({
        where: { token: mockToken }
      });
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a refresh token', async () => {
      const mockToken = 'token-to-revoke';

      await service.revokeRefreshToken(mockToken);

      expect(mockRefreshTokenModel.destroy).toHaveBeenCalledWith({
        where: { token: mockToken }
      });
    });
  });

  describe('refreshTokens', () => {
    it('should return new access and refresh tokens', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const newRefreshToken = 'new-refresh-token';
      const mockUser = { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', phone: '+79990001122', toJSON: () => ({ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', phone: '+79990001122' }) } as unknown as User;
      const mockNewAccessToken = { token: 'new-access-token' };
      const mockNewRefreshToken = { token: 'new-refresh-token' };

      mockRefreshTokenModel.findOne.mockResolvedValue({
        token: oldRefreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        user: mockUser,
      });

      mockJwtService.signAsync.mockResolvedValue('new-access-token');

      mockRefreshTokenModel.create.mockResolvedValue(mockNewRefreshToken);

      const result = await service.refreshTokens(oldRefreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      expect(mockRefreshTokenModel.destroy).toHaveBeenCalledWith({
        where: { token: oldRefreshToken }
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});