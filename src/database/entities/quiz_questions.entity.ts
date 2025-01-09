import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { GameRooms } from "./game_rooms.entity";
import { QuizAnswers } from "./quiz_answers.entity";
import { CurrentQuestions } from "./current_questions.entity";
import { PlayerAnswers } from "./player_answers.entity";

@Entity()
export class QuizQuestions extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text', nullable: false})
    content: string

    @Column({type:'int', nullable:false})
    position: number

    @Column({type:'text', nullable:true})
    image: string

    @Column({type:'int', nullable:false, default: 5})
    cooldown: number

    @Column({type:'int', nullable:false, default: 15})
    time: number

    @ManyToOne(() => GameRooms, game_room => game_room.questions)
    @JoinColumn({ name: 'game_room_id' })
    games: Relation<GameRooms>;

    @ManyToOne(() => QuizAnswers)
    @JoinColumn({ name: 'solution' })
    solution: Relation<QuizAnswers>;

    @OneToMany(() => QuizAnswers, quiz_answer => quiz_answer.question)
    answers: Relation<QuizAnswers>[];

    @OneToMany(() => CurrentQuestions, current_questions => current_questions.quiz_question)
    current_questions: Relation<CurrentQuestions>[];

    @OneToMany(()=> PlayerAnswers, player_answer => player_answer.questions)
    player_answer: Relation<PlayerAnswers[]>;
}
