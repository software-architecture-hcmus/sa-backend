import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity";
import { Games } from "./games.entity";

@Entity()
export class RequestTurn extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Games, game => game.request_turns)
    @JoinColumn({name: 'game_id'})
    game: Relation<Games>;

    @Column('text')
    sender_id: string;

    @Column('text')
    receiver_id: string;
}