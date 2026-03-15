import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../user/entities/user.entity';
import { ReservationHistory } from '../reservation-history/entities/reservation-history.entity';

@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ReservationHistory)
    private reservationHistoryRepository: Repository<ReservationHistory>,
  ) { }

  async create(dto: CreateReservationDto) {

    const concert = await this.concertRepository.findOne({
      where: { id: dto.concertId }
    });

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.reservationRepository.findOne({
      where: {
        user: { id: user.id },
        concert: { id: concert.id }
      },
      relations: ['concert']
    });

    if (existing) {

      if (existing.status === ReservationStatus.RESERVED) {
        throw new BadRequestException('Already reserved');
      }

      if (concert.availableSeats <= 0) {
        throw new BadRequestException('No seats available');
      }

      concert.availableSeats -= 1;
      await this.concertRepository.save(concert);

      existing.status = ReservationStatus.RESERVED;
      const savedReservation = await this.reservationRepository.save(existing);

      // Create history entry
      await this.reservationHistoryRepository.save({
        user,
        reservation: savedReservation,
        action: 'RESERVED'
      });

      return savedReservation;
    }

    if (concert.availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    concert.availableSeats -= 1;
    await this.concertRepository.save(concert);

    const reservation = this.reservationRepository.create({
      user,
      concert
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Create history entry
    await this.reservationHistoryRepository.save({
      user,
      reservation: savedReservation,
      action: 'RESERVED'
    });

    return savedReservation;
  }

  async cancel(reservationId: string) {

    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['concert', 'user']
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation already cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;

    const concert = reservation.concert;
    if (concert.availableSeats < concert.totalSeats) {
      concert.availableSeats += 1;
    }

    await this.concertRepository.save(concert);

    const savedReservation = await this.reservationRepository.save(reservation);

    // Create history entry
    await this.reservationHistoryRepository.save({
      user: reservation.user,
      reservation: savedReservation,
      action: 'CANCELLED'
    });

    return savedReservation;
  }
}
