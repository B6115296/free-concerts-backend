import { Controller, Get } from '@nestjs/common';
import { ReservationHistoryService } from './reservation-history.service';

@Controller('reservation-history')
export class ReservationHistoryController {
  constructor(private readonly reservationHistoryService: ReservationHistoryService) {}

  @Get()
  getHistory() {
    return this.reservationHistoryService.findAllHistory();
  }
}
