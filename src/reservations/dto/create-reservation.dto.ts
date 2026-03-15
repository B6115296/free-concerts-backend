import { IsEmail, IsUUID } from "class-validator";

export class CreateReservationDto {

  @IsUUID()
  concertId: string;

  @IsEmail()
  email: string;
}