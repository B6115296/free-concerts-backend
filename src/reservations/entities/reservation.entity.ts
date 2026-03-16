import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Concert } from "../../concerts/entities/concert.entity";
import { User } from "../../user/entities/user.entity";

export enum ReservationStatus {
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED',
}

@Entity()
@Unique(['user', 'concert'])
export class Reservation {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.reservations)
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations, {
    onDelete: "CASCADE",
  })
  concert: Concert;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;
}