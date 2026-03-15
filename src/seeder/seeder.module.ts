import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Concert } from '../concerts/entities/concert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
