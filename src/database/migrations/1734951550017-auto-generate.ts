import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734951550017 implements MigrationInterface {
    name = 'AutoGenerate1734951550017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_players" DROP CONSTRAINT "PK_fa8e2bcf2f068c20f4c3e05ab5f"`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD "customer_id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD CONSTRAINT "PK_1c348ba86cf4de0472fe47949dc" PRIMARY KEY ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD "game_room_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP CONSTRAINT "PK_1c348ba86cf4de0472fe47949dc"`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD CONSTRAINT "PK_4487112c57945173f5849f7905f" PRIMARY KEY ("customer_id", "game_room_id")`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD "score" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD CONSTRAINT "FK_334dcadf8716cf73ab7b12aab2c" FOREIGN KEY ("game_room_id") REFERENCES "game_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_players" DROP CONSTRAINT "FK_334dcadf8716cf73ab7b12aab2c"`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP CONSTRAINT "PK_4487112c57945173f5849f7905f"`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD CONSTRAINT "PK_1c348ba86cf4de0472fe47949dc" PRIMARY KEY ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP COLUMN "game_room_id"`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP CONSTRAINT "PK_1c348ba86cf4de0472fe47949dc"`);
        await queryRunner.query(`ALTER TABLE "room_players" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "room_players" ADD CONSTRAINT "PK_fa8e2bcf2f068c20f4c3e05ab5f" PRIMARY KEY ("id")`);
    }

}
