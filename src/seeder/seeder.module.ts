import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
