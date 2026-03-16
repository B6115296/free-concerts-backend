import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'john.doe@example.com',
    };

    const invalidLoginDto: LoginDto = {
      email: 'invalid@example.com',
    };

    const mockUser = {
      id: 'user-uuid',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
    };

    it('should return success response for valid login', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.login(validLoginDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(validLoginDto.email);
      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('should return failure response for invalid credentials', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await controller.login(invalidLoginDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(invalidLoginDto.email);
      expect(result).toEqual({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should return failure response for user with wrong email', async () => {
      const wrongUser = {
        id: 'user-uuid',
        name: 'Wrong User',
        email: 'wrong@example.com',
      };

      mockUserService.findByEmail.mockResolvedValue(wrongUser);

      const result = await controller.login(invalidLoginDto);

      expect(result).toEqual({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should handle service errors gracefully', async () => {
      mockUserService.findByEmail.mockRejectedValue(new Error('Database error'));

      await expect(controller.login(validLoginDto)).rejects.toThrow('Database error');
    });

    it('should call userService with correct email', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await controller.login(validLoginDto);

      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    });

    it('should return user data without sensitive fields', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.login(validLoginDto);

      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
      // Should not include createdAt or other sensitive fields
      expect(result.user).not.toHaveProperty('createdAt');
    });
  });
});
