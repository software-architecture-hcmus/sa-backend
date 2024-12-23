import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734953281604 implements MigrationInterface {
    name = 'AutoGenerate1734953281604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "current_questions" DROP CONSTRAINT "PK_1ad3db8f710f803fe5e6e283244"`);
        await queryRunner.query(`ALTER TABLE "current_questions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD "game_room_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD CONSTRAINT "PK_4624179ee30312d8954edb7e089" PRIMARY KEY ("game_room_id")`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD "quiz_question" uuid`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD CONSTRAINT "FK_4624179ee30312d8954edb7e089" FOREIGN KEY ("game_room_id") REFERENCES "game_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD CONSTRAINT "FK_862c78ec14b397e8f01262e2f9b" FOREIGN KEY ("quiz_question") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "current_questions" DROP CONSTRAINT "FK_862c78ec14b397e8f01262e2f9b"`);
        await queryRunner.query(`ALTER TABLE "current_questions" DROP CONSTRAINT "FK_4624179ee30312d8954edb7e089"`);
        await queryRunner.query(`ALTER TABLE "current_questions" DROP COLUMN "quiz_question"`);
        await queryRunner.query(`ALTER TABLE "current_questions" DROP CONSTRAINT "PK_4624179ee30312d8954edb7e089"`);
        await queryRunner.query(`ALTER TABLE "current_questions" DROP COLUMN "game_room_id"`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "current_questions" ADD CONSTRAINT "PK_1ad3db8f710f803fe5e6e283244" PRIMARY KEY ("id")`);
    }

}
