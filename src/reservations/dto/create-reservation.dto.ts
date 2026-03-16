import { IsEmail, IsUUID, IsNotEmpty } from "class-validator";

export class CreateReservationDto {

  @IsNotEmpty({ message: 'Concert ID is required' })
  @IsUUID(4, { message: 'Concert ID must be a valid UUID' })
  concertId: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}