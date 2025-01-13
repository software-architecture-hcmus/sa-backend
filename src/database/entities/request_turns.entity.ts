import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity";
import { Games } from "./games.entity";
import { TripleStatus } from "../enums/triple-status.enum";

@Entity()
export class RequestTurn extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TripleStatus,
        nullable: false,
        default: 'PENDING'
    })
    status: TripleStatus;


    @ManyToOne(() => Games, game => game.request_turns)
    @JoinColumn({ name: 'game_id' })
    game: Relation<Games>;

    @Column('text')
    sender_id: string;

    @Column('text')
    receiver_id: string;
}