import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { ReservationHistory } from '../reservation-history/entities/reservation-history.entity';

@Injectable()
export class ConcertsService {

  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationHistory)
    private reservationHistoryRepository: Repository<ReservationHistory>,
  ) { }

  async create(createConcertDto: CreateConcertDto) {

    const concert = this.concertRepository.create({
      ...createConcertDto,
      availableSeats: createConcertDto.totalSeats
    });

    await this.concertRepository.save(concert);
    return concert;
  }

  async findAllConcertsAdmin() {
    return this.concertRepository.find({
      order: {
        createdAt: "ASC",
      },
    });
  }

  async findAllConcertsUser(userId: string) {

    const concerts = await this.concertRepository.find({
      order: {
        name: "ASC",
      },
    });

    const reservations = await this.reservationRepository.find({
      where: {
        user: { id: userId },
        status: ReservationStatus.RESERVED
      },
      relations: ['concert']
    });

    const reservationMap = new Map<string, string>();
    reservations.forEach(r => {
      reservationMap.set(r.concert.id, r.id);
    });

    return concerts.map(concert => ({
      ...concert,
      reserved: reservationMap.has(concert.id),
      reservationId: reservationMap.get(concert.id) || null
    }));
  }

  async getSeatsSummary() {
    const concerts = await this.concertRepository.find();

    // Get all reservation history for all concerts
    const allHistory = await this.reservationHistoryRepository.find({
      relations: ['reservation', 'reservation.concert']
    });

    const reservedCount = allHistory.filter(
      h => h.action === 'RESERVED'
    ).length;

    const cancelledCount = allHistory.filter(
      h => h.action === 'CANCELLED'
    ).length;

    const totalSeats = concerts.reduce(
      (sum, concert) => sum + concert.totalSeats,
      0
    );

    return {
      totalSeats: totalSeats,
      reservedSeats: reservedCount,
      cancelledSeats: cancelledCount
    };
  }

  async remove(id: string) {
    return this.concertRepository.delete(id);
  }
}
