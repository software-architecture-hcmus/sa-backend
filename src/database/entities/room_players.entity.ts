import { Entity, Column, ManyToOne, JoinColumn, Relation, PrimaryColumn } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameRooms } from "./game_rooms.entity";

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

}
