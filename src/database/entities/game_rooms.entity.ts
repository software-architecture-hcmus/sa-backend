import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameResults } from "./game_results.entity";
import { Games } from "./games.entity";

@Entity()
export class GameRooms extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text', nullable:true})
    invite_code: string

    @OneToMany(() => GameResults, game_results => game_results.id)
    @JoinColumn({ name: 'game_room_id' })
    results: Relation<GameResults>[];

    @ManyToOne(() => Games, games => games.rooms)
    @JoinColumn({ name: 'game_id' })
    games: Relation<Games>
}
