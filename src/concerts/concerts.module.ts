import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { UserConcertsController } from './user-concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { AdminConcertsController } from './admin-concerts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation])],
  controllers: [UserConcertsController, AdminConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
