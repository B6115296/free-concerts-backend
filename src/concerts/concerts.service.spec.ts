import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationHistory } from '../reservation-history/entities/reservation-history.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertRepository: Repository<Concert>;
  let reservationRepository: Repository<Reservation>;
  let reservationHistoryRepository: Repository<ReservationHistory>;

  const mockConcertRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockReservationRepository = {
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockReservationHistoryRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(ReservationHistory),
          useValue: mockReservationHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    concertRepository = module.get<Repository<Concert>>(getRepositoryToken(Concert));
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    reservationHistoryRepository = module.get<Repository<ReservationHistory>>(getRepositoryToken(ReservationHistory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a concert successfully', async () => {
      const createConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
      };

      const expectedConcert = {
        id: 'concert-uuid',
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
        availableSeats: 100,
        createdAt: new Date(),
      };

      mockConcertRepository.create.mockReturnValue(expectedConcert);
      mockConcertRepository.save.mockResolvedValue(expectedConcert);

      const result = await service.create(createConcertDto);

      expect(mockConcertRepository.create).toHaveBeenCalledWith({
        ...createConcertDto,
        availableSeats: 100,
      });
      expect(mockConcertRepository.save).toHaveBeenCalledWith(expectedConcert);
      expect(result).toEqual(expectedConcert);
    });
  });

  describe('findAllConcertsAdmin', () => {
    it('should return all concerts', async () => {
      const concerts = [
        { id: '1', name: 'Concert 1' },
        { id: '2', name: 'Concert 2' },
      ];

      mockConcertRepository.find.mockResolvedValue(concerts);

      const result = await service.findAllConcertsAdmin();

      expect(mockConcertRepository.find).toHaveBeenCalled();
      expect(result).toEqual(concerts);
    });
  });

  describe('findAllConcertsUser', () => {
    it('should return concerts with reservation status for user', async () => {
      const userId = 'user-uuid';
      const concerts = [
        { id: 'concert-1', name: 'Concert 1' },
        { id: 'concert-2', name: 'Concert 2' },
      ];

      const reservations = [
        {
          id: 'reservation-1',
          user: { id: userId },
          concert: { id: 'concert-1' },
          status: 'RESERVED',
        },
      ];

      mockConcertRepository.find.mockResolvedValue(concerts);
      mockReservationRepository.find.mockResolvedValue(reservations);

      const result = await service.findAllConcertsUser(userId);

      expect(result).toEqual([
        { ...concerts[0], reserved: true, reservationId: 'reservation-1' },
        { ...concerts[1], reserved: false, reservationId: null },
      ]);
    });

    it('should handle user with no reservations', async () => {
      const userId = 'user-uuid';
      const concerts = [{ id: 'concert-1', name: 'Concert 1' }];

      mockConcertRepository.find.mockResolvedValue(concerts);
      mockReservationRepository.find.mockResolvedValue([]);

      const result = await service.findAllConcertsUser(userId);

      expect(result).toEqual([
        { ...concerts[0], reserved: false, reservationId: null },
      ]);
    });
  });

  describe('getSeatsSummary', () => {
    it('should return aggregated seat summary across all concerts', async () => {
      const concerts = [
        { id: '1', totalSeats: 100 },
        { id: '2', totalSeats: 200 },
      ];

      const history = [
        { action: 'RESERVED' },
        { action: 'RESERVED' },
        { action: 'CANCELLED' },
      ];

      mockConcertRepository.find.mockResolvedValue(concerts);
      mockReservationHistoryRepository.find.mockResolvedValue(history);

      const result = await service.getSeatsSummary();

      expect(result).toEqual({
        totalSeats: 300,
        reservedSeats: 2,
        cancelledSeats: 1,
      });
    });

    it('should handle empty database', async () => {
      mockConcertRepository.find.mockResolvedValue([]);
      mockReservationHistoryRepository.find.mockResolvedValue([]);

      const result = await service.getSeatsSummary();

      expect(result).toEqual({
        totalSeats: 0,
        reservedSeats: 0,
        cancelledSeats: 0,
      });
    });
  });

  describe('remove', () => {
    it('should delete a concert successfully', async () => {
      const concertId = 'concert-uuid';

      mockConcertRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(concertId);

      expect(mockConcertRepository.delete).toHaveBeenCalledWith(concertId);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
