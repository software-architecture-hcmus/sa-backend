import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { AuditableEntity } from "../../lib/entities/auditable.entity"
import { QuizQuestions } from "./quiz_questions.entity";
import { PlayerAnswers } from "./player_answers.entity";

@Entity()
export class QuizAnswers extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text', nullable:false})
    content: string

    @ManyToOne(() => QuizQuestions, quiz_question => quiz_question.answers)
    @JoinColumn({ name: 'quiz_question_id' })
    question: Relation<QuizQuestions>;

    @OneToMany(() => PlayerAnswers, player_answer => player_answer.answer)
    @JoinColumn({ name: 'answer' })
    player_answer: Relation<PlayerAnswers>[];
}
