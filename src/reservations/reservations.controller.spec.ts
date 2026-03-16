import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: ReservationsService;

  const mockReservationsService = {
    create: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation successfully', async () => {
      const createReservationDto: CreateReservationDto = {
        concertId: 'concert-uuid',
        email: 'test@example.com',
      };

      const createdReservation = {
        id: 'reservation-uuid',
        user: { id: 'user-uuid', name: 'Test User', email: 'test@example.com' },
        concert: { id: 'concert-uuid', name: 'Test Concert' },
        status: 'RESERVED',
        createdAt: new Date(),
      };

      mockReservationsService.create.mockResolvedValue(createdReservation);

      const result = await controller.create(createReservationDto);

      expect(reservationsService.create).toHaveBeenCalledWith(createReservationDto);
      expect(result).toEqual(createdReservation);
    });

    it('should handle validation errors', async () => {
      const createReservationDto: CreateReservationDto = {
        concertId: 'invalid-uuid',
        email: 'invalid-email',
      };

      mockReservationsService.create.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.create(createReservationDto)).rejects.toThrow('Validation failed');
    });

    it('should handle not found errors', async () => {
      const createReservationDto: CreateReservationDto = {
        concertId: 'nonexistent-uuid',
        email: 'test@example.com',
      };

      mockReservationsService.create.mockRejectedValue(new Error('Concert not found'));

      await expect(controller.create(createReservationDto)).rejects.toThrow('Concert not found');
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation successfully', async () => {
      const reservationId = 'reservation-uuid';

      const cancelledReservation = {
        id: reservationId,
        user: { id: 'user-uuid', name: 'Test User' },
        concert: { id: 'concert-uuid', name: 'Test Concert' },
        status: 'CANCELLED',
        createdAt: new Date(),
      };

      mockReservationsService.cancel.mockResolvedValue(cancelledReservation);

      const result = await controller.cancel(reservationId);

      expect(reservationsService.cancel).toHaveBeenCalledWith(reservationId);
      expect(result).toEqual(cancelledReservation);
    });

    it('should handle reservation not found', async () => {
      const reservationId = 'nonexistent-uuid';

      mockReservationsService.cancel.mockRejectedValue(new Error('Reservation not found'));

      await expect(controller.cancel(reservationId)).rejects.toThrow('Reservation not found');
    });

    it('should handle already cancelled reservation', async () => {
      const reservationId = 'already-cancelled-uuid';

      mockReservationsService.cancel.mockRejectedValue(new Error('Reservation already cancelled'));

      await expect(controller.cancel(reservationId)).rejects.toThrow('Reservation already cancelled');
    });

    it('should handle service errors', async () => {
      const reservationId = 'reservation-uuid';

      mockReservationsService.cancel.mockRejectedValue(new Error('Database error'));

      await expect(controller.cancel(reservationId)).rejects.toThrow('Database error');
    });
  });
});
