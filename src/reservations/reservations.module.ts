import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../user/entities/user.entity';
import { ReservationHistory } from '../reservation-history/entities/reservation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Concert, User, ReservationHistory])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
