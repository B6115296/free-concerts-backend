import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../user/entities/user.entity';
import { ReservationHistory, ReservationHistoryAction } from '../reservation-history/entities/reservation-history.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<Reservation>;
  let concertRepository: Repository<Concert>;
  let userRepository: Repository<User>;
  let reservationHistoryRepository: Repository<ReservationHistory>;

  const mockReservationRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockConcertRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockReservationHistoryRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ReservationHistory),
          useValue: mockReservationHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    concertRepository = module.get<Repository<Concert>>(getRepositoryToken(Concert));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    reservationHistoryRepository = module.get<Repository<ReservationHistory>>(getRepositoryToken(ReservationHistory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createReservationDto = {
      concertId: 'concert-uuid',
      email: 'test@example.com',
    };

    const mockConcert = {
      id: 'concert-uuid',
      name: 'Test Concert',
      totalSeats: 100,
      availableSeats: 50,
    };

    const mockUser = {
      id: 'user-uuid',
      name: 'Test User',
      email: 'test@example.com',
    };

    it('should create a new reservation successfully', async () => {
      mockConcertRepository.findOne.mockResolvedValue(mockConcert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockReservationRepository.findOne.mockResolvedValue(null);

      const newReservation = {
        id: 'reservation-uuid',
        user: mockUser,
        concert: mockConcert,
        status: ReservationStatus.RESERVED,
      };

      mockReservationRepository.create.mockReturnValue(newReservation);
      mockReservationRepository.save.mockResolvedValue(newReservation);

      const result = await service.create(createReservationDto);

      expect(mockConcertRepository.findOne).toHaveBeenCalledWith({
        where: { id: createReservationDto.concertId },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createReservationDto.email },
      });
      expect(result).toEqual(newReservation);
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockConcertRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockConcertRepository.findOne.mockResolvedValue(mockConcert);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when no seats available', async () => {
      const noSeatsConcert = { ...mockConcert, availableSeats: 0 };
      mockConcertRepository.findOne.mockResolvedValue(noSeatsConcert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when already reserved', async () => {
      const existingReservation = {
        status: ReservationStatus.RESERVED,
      };

      mockConcertRepository.findOne.mockResolvedValue(mockConcert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockReservationRepository.findOne.mockResolvedValue(existingReservation);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reactivate cancelled reservation', async () => {
      const cancelledReservation = {
        id: 'existing-reservation',
        status: ReservationStatus.CANCELLED,
      };

      mockConcertRepository.findOne.mockResolvedValue(mockConcert);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockReservationRepository.findOne.mockResolvedValue(cancelledReservation);
      mockReservationRepository.save.mockResolvedValue({
        ...cancelledReservation,
        status: ReservationStatus.RESERVED,
      });

      const result = await service.create(createReservationDto);

      expect(mockReservationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ReservationStatus.RESERVED,
        }),
      );
      expect(mockReservationHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ReservationHistoryAction.RESERVED,
        }),
      );
    });
  });

  describe('cancel', () => {
    const reservationId = 'reservation-uuid';

    const mockReservation = {
      id: reservationId,
      status: ReservationStatus.RESERVED,
      user: { id: 'user-uuid', name: 'Test User' },
      concert: {
        id: 'concert-uuid',
        name: 'Test Concert',
        totalSeats: 100,
        availableSeats: 50,
      },
    };

    it('should cancel a reservation successfully', async () => {
      mockReservationRepository.findOne.mockResolvedValue(mockReservation);
      mockConcertRepository.save.mockResolvedValue(mockReservation.concert);
      mockReservationRepository.save.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
      });

      const result = await service.cancel(reservationId);

      expect(mockReservationRepository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId },
        relations: ['concert', 'user'],
      });
      expect(result.status).toBe(ReservationStatus.CANCELLED);
      expect(mockReservationHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ReservationHistoryAction.CANCELLED,
        }),
      );
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.cancel(reservationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when already cancelled', async () => {
      const cancelledReservation = {
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
      };

      mockReservationRepository.findOne.mockResolvedValue(cancelledReservation);

      await expect(service.cancel(reservationId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should increment available seats when cancelling', async () => {
      const originalAvailableSeats = 99;
      const totalSeats = 100;
      
      const concert = {
        ...mockReservation.concert,
        totalSeats: totalSeats,
        availableSeats: originalAvailableSeats, // Less than totalSeats before cancellation
      };

      const reservationWithConcert = {
        ...mockReservation,
        concert: concert,
        status: ReservationStatus.RESERVED,
      };

      mockReservationRepository.findOne.mockResolvedValue(reservationWithConcert);
      mockConcertRepository.save.mockResolvedValue({
        ...concert,
        availableSeats: totalSeats, // Incremented after cancellation
      });
      mockReservationRepository.save.mockResolvedValue({
        ...reservationWithConcert,
        status: ReservationStatus.CANCELLED,
      });

      await service.cancel(reservationId);

      // Verify the concert had less available seats before cancellation
      expect(originalAvailableSeats).toBeLessThan(totalSeats);
      // Verify the service was called to increment seats to total
      expect(mockConcertRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          availableSeats: totalSeats,
        }),
      );
    });
  });
});
