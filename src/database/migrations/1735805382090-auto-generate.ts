import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1735805382090 implements MigrationInterface {
    name = 'AutoGenerate1735805382090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_answers" ADD "point" numeric DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "game_rooms" DROP CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9"`);
        await queryRunner.query(`ALTER TABLE "game_rooms" ALTER COLUMN "game_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_rooms" ADD CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_rooms" DROP CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9"`);
        await queryRunner.query(`ALTER TABLE "game_rooms" ALTER COLUMN "game_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_rooms" ADD CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_answers" DROP COLUMN "point"`);
    }

}
