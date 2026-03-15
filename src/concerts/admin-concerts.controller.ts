import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('admin/concerts')
export class AdminConcertsController {
  constructor(private readonly concertsService: ConcertsService) { }

  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  findAllConcerts() {
    return this.concertsService.findAllConcertsAdmin();
  }

  @Get('seats-summary')
  getSeatsSummary() {
    return this.concertsService.getSeatsSummary();
  }

  @Delete(':id')
  removeConcert(@Param('id') id: string) {
    return this.concertsService.remove(id);
  }
}
