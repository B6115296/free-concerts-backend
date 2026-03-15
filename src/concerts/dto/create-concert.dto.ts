import { IsInt, IsString } from "class-validator";

export class CreateConcertDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsInt()
    totalSeats: number;
}
