import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734954373795 implements MigrationInterface {
    name = 'AutoGenerate1734954373795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_answers" ADD "customer_id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player_answers" ADD "game_room_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player_answers" ADD "answer" uuid`);
        await queryRunner.query(`ALTER TABLE "player_answers" ADD CONSTRAINT "FK_5023819254e99a474c00e9e8aa7" FOREIGN KEY ("answer") REFERENCES "quiz_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_answers" ADD CONSTRAINT "FK_65570051b578fb32269d7071e69" FOREIGN KEY ("customer_id", "game_room_id") REFERENCES "room_players"("customer_id","game_room_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_answers" DROP CONSTRAINT "FK_65570051b578fb32269d7071e69"`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP CONSTRAINT "FK_5023819254e99a474c00e9e8aa7"`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP COLUMN "answer"`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP COLUMN "game_room_id"`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP COLUMN "customer_id"`);
    }

}
