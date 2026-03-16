import { Test, TestingModule } from '@nestjs/testing';
import { UserConcertsController } from './user-concerts.controller';
import { ConcertsService } from './concerts.service';

describe('UserConcertsController', () => {
  let controller: UserConcertsController;
  let concertsService: ConcertsService;

  const mockConcertsService = {
    findAllConcertsUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    controller = module.get<UserConcertsController>(UserConcertsController);
    concertsService = module.get<ConcertsService>(ConcertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return concerts with reservation status for user', async () => {
      const userId = 'user-uuid';
      const mockConcerts = [
        {
          id: 'concert-1',
          name: 'Rock Night 2024',
          reserved: true,
          reservationId: 'res-1',
        },
        {
          id: 'concert-2',
          name: 'Jazz Evening',
          reserved: false,
          reservationId: null,
        },
      ];

      mockConcertsService.findAllConcertsUser.mockResolvedValue(mockConcerts);

      const result = await controller.findAll(userId);

      expect(concertsService.findAllConcertsUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockConcerts);
    });

    it('should handle user with no reservations', async () => {
      const userId = 'user-uuid';
      const mockConcerts = [
        {
          id: 'concert-1',
          name: 'Rock Night 2024',
          reserved: false,
          reservationId: null,
        },
      ];

      mockConcertsService.findAllConcertsUser.mockResolvedValue(mockConcerts);

      const result = await controller.findAll(userId);

      expect(result).toEqual(mockConcerts);
    });

    it('should handle empty concerts list', async () => {
      const userId = 'user-uuid';

      mockConcertsService.findAllConcertsUser.mockResolvedValue([]);

      const result = await controller.findAll(userId);

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const userId = 'user-uuid';

      mockConcertsService.findAllConcertsUser.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll(userId)).rejects.toThrow('Database error');
    });

    it('should handle invalid user ID', async () => {
      const invalidUserId = 'invalid-uuid';

      mockConcertsService.findAllConcertsUser.mockRejectedValue(new Error('User not found'));

      await expect(controller.findAll(invalidUserId)).rejects.toThrow('User not found');
    });

    it('should return concerts in correct format', async () => {
      const userId = 'user-uuid';
      const mockConcerts = [
        {
          id: 'concert-1',
          name: 'Rock Night 2024',
          description: 'Amazing rock concert',
          totalSeats: 500,
          availableSeats: 450,
          reserved: true,
          reservationId: 'res-1',
          createdAt: new Date(),
        },
      ];

      mockConcertsService.findAllConcertsUser.mockResolvedValue(mockConcerts);

      const result = await controller.findAll(userId);

      expect(result).toEqual(mockConcerts);
      expect(mockConcertsService.findAllConcertsUser).toHaveBeenCalledWith(userId);
    });
  });
});
