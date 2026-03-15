import { Controller, Get, Param } from '@nestjs/common';
import { ConcertsService } from './concerts.service';

@Controller('concerts')
export class UserConcertsController {
  constructor(private readonly concertsService: ConcertsService) { }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.concertsService.findAllConcertsUser(id);
  }
}
