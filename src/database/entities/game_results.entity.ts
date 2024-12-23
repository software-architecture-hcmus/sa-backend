import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameRooms } from "./game_rooms.entity";

@Entity()
export class GameResults extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', nullable: true, default:0})
    score: number;

    @Column({ type: 'text', nullable: false })
    customer_id: string;

    @ManyToOne(() => GameRooms, game_room => game_room.results)
    @JoinColumn({ name: 'game_room_id' })
    game_room: Relation<GameRooms>;

}
