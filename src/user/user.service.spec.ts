import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      const user = {
        id: 'user-uuid',
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('john.doe@example.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
