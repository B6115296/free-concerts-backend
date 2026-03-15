import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';

@Injectable()
export class ConcertsService {

  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
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
    return this.concertRepository.find();
  }

  async findAllConcertsUser(userId: string) {

    const concerts = await this.concertRepository.find();

    const reservations = await this.reservationRepository.find({
      where: {
        user: { id: userId },
        status: ReservationStatus.RESERVED
      },
      relations: ['concert']
    });

    const reservedConcertIds = reservations.map(r => r.concert.id);

    return concerts.map(concert => ({
      ...concert,
      reserved: reservedConcertIds.includes(concert.id)
    }));
  }

  remove(id: number) {
    return this.concertRepository.delete(id.toString());
  }
}
