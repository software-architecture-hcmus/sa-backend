import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734952684695 implements MigrationInterface {
    name = 'AutoGenerate1734952684695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_answers" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" ADD "quiz_question_id" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "image" text`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "cooldown" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "time" integer NOT NULL DEFAULT '15'`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "game_room_id" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD "solution" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" ADD CONSTRAINT "FK_ffc3a21a6d2d56327fb85387f8d" FOREIGN KEY ("quiz_question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD CONSTRAINT "FK_d70d925dc127d052ce33d838186" FOREIGN KEY ("game_room_id") REFERENCES "game_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD CONSTRAINT "FK_572c0da5fb89b7f60fe66a7d1d7" FOREIGN KEY ("solution") REFERENCES "quiz_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP CONSTRAINT "FK_572c0da5fb89b7f60fe66a7d1d7"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP CONSTRAINT "FK_d70d925dc127d052ce33d838186"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" DROP CONSTRAINT "FK_ffc3a21a6d2d56327fb85387f8d"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "solution"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "game_room_id"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "cooldown"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" DROP COLUMN "quiz_question_id"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" DROP COLUMN "content"`);
    }

}
