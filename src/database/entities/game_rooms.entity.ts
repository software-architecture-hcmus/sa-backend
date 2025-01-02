import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameResults } from "./game_results.entity";
import { Games } from "./games.entity";
import { RoomPlayers } from "./room_players.entity";
import { QuizQuestions } from "./quiz_questions.entity";
import { CurrentQuestions } from "./current_questions.entity";

@Entity()
export class GameRooms extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text', nullable:true})
    invite_code: string
    
    @Column({ type: 'uuid' })
    game_id: string;

    @OneToMany(() => GameResults, game_results => game_results.game_room)
    results: Relation<GameResults>[];

    @OneToMany(() => RoomPlayers, room_player => room_player.games)
    room_players: RoomPlayers[];

    @OneToMany(() => QuizQuestions, quiz_questions => quiz_questions.games)
    questions: Relation<QuizQuestions>[];

    @ManyToOne(() => Games, games => games.rooms)
    @JoinColumn({ name: 'game_id' })
    games: Relation<Games>

    @OneToMany(() => CurrentQuestions, current_questions => current_questions.rooms)
    current_questions: Relation<CurrentQuestions>[];
}
