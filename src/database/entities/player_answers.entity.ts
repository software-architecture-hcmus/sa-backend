import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { QuizAnswers } from "./quiz_answers.entity";
import { RoomPlayers } from "./room_players.entity";
@Entity()
export class PlayerAnswers extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    time: string;
    @Column({ type: 'number', nullable: true, default: 0 })
    point:number

    @ManyToOne(() => QuizAnswers, quiz_answer => quiz_answer.player_answer)
    @JoinColumn({ name: 'answer' })
    answer: Relation<QuizAnswers>;

   // Foreign keys referencing RoomPlayers
   @Column({ type: 'text' })
   customer_id: string;

   @Column({ type: 'uuid' })
   game_room_id: string;

   @ManyToOne(() => RoomPlayers, room_players => room_players.player_answer)
    @JoinColumn([
        { name: 'customer_id', referencedColumnName: 'customer_id' },
        { name: 'game_room_id', referencedColumnName: 'game_room_id' }
    ])
    room_players: Relation<RoomPlayers>;
}
