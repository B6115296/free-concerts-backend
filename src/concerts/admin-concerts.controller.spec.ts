import { Test, TestingModule } from '@nestjs/testing';
import { AdminConcertsController } from './admin-concerts.controller';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

describe('AdminConcertsController', () => {
  let controller: AdminConcertsController;
  let concertsService: ConcertsService;

  const mockConcertsService = {
    create: jest.fn(),
    findAllConcertsAdmin: jest.fn(),
    remove: jest.fn(),
    getSeatsSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    controller = module.get<AdminConcertsController>(AdminConcertsController);
    concertsService = module.get<ConcertsService>(ConcertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a concert successfully', async () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
      };

      const createdConcert = {
        id: 'concert-uuid',
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
        availableSeats: 100,
        createdAt: new Date(),
      };

      mockConcertsService.create.mockResolvedValue(createdConcert);

      const result = await controller.create(createConcertDto);

      expect(concertsService.create).toHaveBeenCalledWith(createConcertDto);
      expect(result).toEqual(createdConcert);
    });

    it('should handle service errors', async () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'Test Description',
        totalSeats: 100,
      };

      mockConcertsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createConcertDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAllConcerts', () => {
    it('should return all concerts', async () => {
      const concerts = [
        { id: '1', name: 'Concert 1' },
        { id: '2', name: 'Concert 2' },
      ];

      mockConcertsService.findAllConcertsAdmin.mockResolvedValue(concerts);

      const result = await controller.findAllConcerts();

      expect(concertsService.findAllConcertsAdmin).toHaveBeenCalled();
      expect(result).toEqual(concerts);
    });

    it('should handle empty concerts list', async () => {
      mockConcertsService.findAllConcertsAdmin.mockResolvedValue([]);

      const result = await controller.findAllConcerts();

      expect(result).toEqual([]);
    });
  });

  describe('getSeatsSummary', () => {
    it('should return seats summary', async () => {
      const summary = {
        totalSeats: 500,
        reservedSeats: 100,
        cancelledSeats: 20,
      };

      mockConcertsService.getSeatsSummary.mockResolvedValue(summary);

      const result = await controller.getSeatsSummary();

      expect(concertsService.getSeatsSummary).toHaveBeenCalled();
      expect(result).toEqual(summary);
    });
  });

  describe('removeConcert', () => {
    it('should delete a concert successfully', async () => {
      const concertId = 'concert-uuid';
      const deleteResult = { affected: 1 };

      mockConcertsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.removeConcert(concertId);

      expect(concertsService.remove).toHaveBeenCalledWith(concertId);
      expect(result).toEqual(deleteResult);
    });

    it('should handle concert not found', async () => {
      const concertId = 'nonexistent-uuid';
      const deleteResult = { affected: 0 };

      mockConcertsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.removeConcert(concertId);

      expect(result).toEqual(deleteResult);
    });

    it('should handle service errors', async () => {
      const concertId = 'concert-uuid';

      mockConcertsService.remove.mockRejectedValue(new Error('Database error'));

      await expect(controller.removeConcert(concertId)).rejects.toThrow('Database error');
    });
  });
});
