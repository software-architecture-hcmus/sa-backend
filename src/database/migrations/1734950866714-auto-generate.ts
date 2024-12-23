import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734950866714 implements MigrationInterface {
    name = 'AutoGenerate1734950866714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_results" ADD "score" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "game_results" ADD "customer_id" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_results" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "game_results" DROP COLUMN "score"`);
    }

}
