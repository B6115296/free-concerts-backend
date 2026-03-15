import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { UserConcertsController } from './user-concerts.controller';
import { AdminConcertsController } from './admin-concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationHistory } from '../reservation-history/entities/reservation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation, ReservationHistory])],
  controllers: [UserConcertsController, AdminConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
