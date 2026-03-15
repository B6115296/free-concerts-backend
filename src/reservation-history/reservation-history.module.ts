import { Module } from '@nestjs/common';
import { ReservationHistoryService } from './reservation-history.service';
import { ReservationHistoryController } from './reservation-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationHistory } from './entities/reservation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationHistory])],
  controllers: [ReservationHistoryController],
  providers: [ReservationHistoryService],
})
export class ReservationHistoryModule {}
