import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationHistoryService } from './reservation-history.service';
import { ReservationHistory } from './entities/reservation-history.entity';
import { Repository } from 'typeorm';

describe('ReservationHistoryService', () => {
  let service: ReservationHistoryService;
  let reservationHistoryRepository: Repository<ReservationHistory>;

  const mockReservationHistoryRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationHistoryService,
        {
          provide: getRepositoryToken(ReservationHistory),
          useValue: mockReservationHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationHistoryService>(ReservationHistoryService);
    reservationHistoryRepository = module.get<Repository<ReservationHistory>>(getRepositoryToken(ReservationHistory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllHistory', () => {
    it('should return formatted reservation history', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          userName: 'John Doe',
          concertName: 'Rock Night 2024',
          action: 'RESERVED',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          user: { id: 'user-1', name: 'John Doe' },
          reservation: { id: 'res-1', concert: { name: 'Rock Night 2024' } },
        },
        {
          id: 'history-2',
          userName: 'Jane Smith',
          concertName: 'Jazz Evening',
          action: 'CANCELLED',
          createdAt: new Date('2024-01-02T15:30:00Z'),
          user: { id: 'user-2', name: 'Jane Smith' },
          reservation: { id: 'res-2', concert: { name: 'Jazz Evening' } },
        },
      ];

      mockReservationHistoryRepository.find.mockResolvedValue(mockHistory);

      const result = await service.findAllHistory();

      expect(mockReservationHistoryRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'reservation', 'reservation.concert'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([
        {
          id: 'history-1',
          reservationId: 'res-1',
          username: 'John Doe',
          concertName: 'Rock Night 2024',
          status: 'Reserve',
          createdAt: mockHistory[0].createdAt,
        },
        {
          id: 'history-2',
          reservationId: 'res-2',
          username: 'Jane Smith',
          concertName: 'Jazz Evening',
          status: 'Cancel',
          createdAt: mockHistory[1].createdAt,
        },
      ]);
    });

    it('should return empty array when no history exists', async () => {
      mockReservationHistoryRepository.find.mockResolvedValue([]);

      const result = await service.findAllHistory();

      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      mockReservationHistoryRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAllHistory()).rejects.toThrow('Database error');
    });

    it('should order results by createdAt descending', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          userName: 'John Doe',
          concertName: 'Rock Night 2024',
          action: 'RESERVED',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          user: { id: 'user-1', name: 'John Doe' },
          reservation: { id: 'res-1', concert: { name: 'Rock Night 2024' } },
        },
        {
          id: 'history-2',
          userName: 'Jane Smith',
          concertName: 'Jazz Evening',
          action: 'CANCELLED',
          createdAt: new Date('2024-01-02T15:30:00Z'),
          user: { id: 'user-2', name: 'Jane Smith' },
          reservation: { id: 'res-2', concert: { name: 'Jazz Evening' } },
        },
      ];

      mockReservationHistoryRepository.find.mockResolvedValue(mockHistory);

      await service.findAllHistory();

      expect(mockReservationHistoryRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { createdAt: 'DESC' },
        }),
      );
    });

    it('should include relations for user, reservation, and concert', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          userName: 'John Doe',
          concertName: 'Rock Night 2024',
          action: 'RESERVED',
          createdAt: new Date(),
          user: { id: 'user-1', name: 'John Doe' },
          reservation: { id: 'res-1', concert: { name: 'Rock Night 2024' } },
        },
      ];

      mockReservationHistoryRepository.find.mockResolvedValue(mockHistory);

      await service.findAllHistory();

      expect(mockReservationHistoryRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['user', 'reservation', 'reservation.concert'],
        }),
      );
    });
  });
});
