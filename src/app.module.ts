import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';
import { UserModule } from './user/user.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ReservationHistoryModule } from './reservation-history/reservation-history.module';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options),
    ConcertsModule, ReservationsModule, UserModule, ReservationHistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
