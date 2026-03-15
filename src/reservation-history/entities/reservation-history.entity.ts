import { Reservation } from "../../reservations/entities/reservation.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReservationHistory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Reservation)
    reservation: Reservation;

    @Column({
        type: 'enum',
        enum: ['RESERVED', 'CANCELLED']
    })
    action: string;

    @CreateDateColumn()
    createdAt: Date;
}