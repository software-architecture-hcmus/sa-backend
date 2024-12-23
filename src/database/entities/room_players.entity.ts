import { Entity, Column, ManyToOne, JoinColumn, Relation, PrimaryColumn, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameRooms } from "./game_rooms.entity";
import { PlayerAnswers } from "./player_answers.entity";

@Entity()
export class RoomPlayers extends AuditableEntity {

    @PrimaryColumn({ type: 'text' })
    customer_id: string;

    @PrimaryColumn({ type: 'uuid' })
    game_room_id: string; 

    @Column({ type: 'int', nullable: true, default: 0 })
    score: number;

    @ManyToOne(() => GameRooms, game_room => game_room.room_players)
    @JoinColumn({ name: 'game_room_id' })
    games: Relation<GameRooms>;

    @OneToMany(() => PlayerAnswers, player_answer => player_answer.room_players)
    player_answer: Relation<PlayerAnswers>[];

}
