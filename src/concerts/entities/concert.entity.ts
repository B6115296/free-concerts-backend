import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "../../reservations/entities/reservation.entity";

@Entity()
export class Concert {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "int" })
  totalSeats: number;

  @Column({ type: "int" })
  availableSeats: number;

  @OneToMany(() => Reservation, reservation => reservation.concert)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;
}