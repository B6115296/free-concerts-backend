import { Injectable } from '@nestjs/common';
import { ReservationHistory } from './entities/reservation-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservationHistoryService {
  constructor(
    @InjectRepository(ReservationHistory)
    private reservationHistoryRepository: Repository<ReservationHistory>,
  ) {}

  async findAllHistory() {
  const reservations = await this.reservationHistoryRepository.find({
    relations: ['user', 'reservation', 'reservation.concert'],
    order: { createdAt: 'DESC' }
  });

  return reservations.map(r => ({
    reservationId: r.reservation.id,
    username: r.user.name,
    concertName: r.reservation.concert.name,
    status: r.action,
    createdAt: r.createdAt
  }));
}
}
