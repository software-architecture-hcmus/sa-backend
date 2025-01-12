import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736442510513 implements MigrationInterface {
    name = 'AutoGenerate1736442510513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_players" ADD "username" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_players" DROP COLUMN "username"`);
    }

}
