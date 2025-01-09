import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736442106157 implements MigrationInterface {
    name = 'AutoGenerate1736442106157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_answers" ADD "question_id" uuid`);
        await queryRunner.query(`ALTER TABLE "player_answers" ADD CONSTRAINT "FK_d41eb479036ff9b200571579610" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_answers" DROP CONSTRAINT "FK_d41eb479036ff9b200571579610"`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP COLUMN "question_id"`);
    }

}
