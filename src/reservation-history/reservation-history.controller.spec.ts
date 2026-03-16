import { Test, TestingModule } from '@nestjs/testing';
import { ReservationHistoryController } from './reservation-history.controller';
import { ReservationHistoryService } from './reservation-history.service';

describe('ReservationHistoryController', () => {
  let controller: ReservationHistoryController;
  let reservationHistoryService: ReservationHistoryService;

  const mockReservationHistoryService = {
    findAllHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationHistoryController],
      providers: [
        {
          provide: ReservationHistoryService,
          useValue: mockReservationHistoryService,
        },
      ],
    }).compile();

    controller = module.get<ReservationHistoryController>(ReservationHistoryController);
    reservationHistoryService = module.get<ReservationHistoryService>(ReservationHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHistory', () => {
    it('should return reservation history', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          reservationId: 'res-1',
          username: 'John Doe',
          concertName: 'Rock Night 2024',
          status: 'Reserve',
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
          id: 'history-2',
          reservationId: 'res-2',
          username: 'Jane Smith',
          concertName: 'Jazz Evening',
          status: 'Cancel',
          createdAt: new Date('2024-01-02T15:30:00Z'),
        },
      ];

      mockReservationHistoryService.findAllHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory();

      expect(reservationHistoryService.findAllHistory).toHaveBeenCalled();
      expect(result).toEqual(mockHistory);
    });

    it('should return empty history when no records exist', async () => {
      mockReservationHistoryService.findAllHistory.mockResolvedValue([]);

      const result = await controller.getHistory();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockReservationHistoryService.findAllHistory.mockRejectedValue(new Error('Database error'));

      await expect(controller.getHistory()).rejects.toThrow('Database error');
    });

    it('should return history in correct format', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          reservationId: 'res-1',
          username: 'John Doe',
          concertName: 'Rock Night 2024',
          status: 'Reserve',
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
      ];

      mockReservationHistoryService.findAllHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory();

      expect(result).toEqual([
        {
          id: 'history-1',
          reservationId: 'res-1',
          username: 'John Doe',
          concertName: 'Rock Night 2024',
          status: 'Reserve',
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
      ]);
    });
  });
});
