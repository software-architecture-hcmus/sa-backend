import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736408599675 implements MigrationInterface {
    name = 'AutoGenerate1736408599675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transaction_time"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transaction_time" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transaction_time"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transaction_time" TIMESTAMP`);
    }
}
