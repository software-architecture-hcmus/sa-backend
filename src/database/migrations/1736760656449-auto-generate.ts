import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736760656449 implements MigrationInterface {
    name = 'AutoGenerate1736760656449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_turns" RENAME COLUMN "account_id" TO "customer_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_turns" RENAME COLUMN "customer_id" TO "account_id"`);
    }

}
