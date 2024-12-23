import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, PrimaryColumn } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameRooms } from "./game_rooms.entity";
import { QuizQuestions } from "./quiz_questions.entity";

@Entity()
export class CurrentQuestions extends AuditableEntity {
    @PrimaryColumn({ type: 'uuid' })
    game_room_id: string;

    @ManyToOne(() => GameRooms, game_room => game_room.current_questions)
    @JoinColumn({ name: 'game_room_id' })
    rooms: Relation<GameRooms>;

    @ManyToOne(() => QuizQuestions, quiz_question => quiz_question.current_questions)
    @JoinColumn({ name: 'quiz_question' })
    quiz_question: Relation<QuizQuestions>;
}
