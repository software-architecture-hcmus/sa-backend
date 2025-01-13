import { Entity, Column, ManyToOne, JoinColumn, Relation, PrimaryGeneratedColumn } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { PlayerAnswers } from "./player_answers.entity";
import { Games } from "./games.entity";

@Entity()
export class GameTurns extends AuditableEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    customer_id: string;

    @Column({ type: 'uuid' })
    game_id: string; 

    @Column({ type: 'int', nullable: true, default: 1 })
    quantity: number;

    @ManyToOne(() => Games, game => game.game_turn)
    @JoinColumn({ name: 'game_id' })
    games: Relation<Games>;

}
