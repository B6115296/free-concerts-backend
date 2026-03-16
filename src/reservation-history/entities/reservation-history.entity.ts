import { Reservation } from "../../reservations/entities/reservation.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ReservationHistoryAction {
    RESERVED = 'RESERVED',
    CANCELLED = 'CANCELLED',
}

@Entity()
export class ReservationHistory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Reservation, (reservation) => reservation, {
        onDelete: "CASCADE",
    })
    reservation: Reservation;

    @Column({
        type: 'enum',
        enum: ReservationHistoryAction
    })
    action: ReservationHistoryAction;

    @CreateDateColumn()
    createdAt: Date;
}