import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736610565667 implements MigrationInterface {
    name = 'AutoGenerate1736610565667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_voucher" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" ADD "code" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_voucher" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" ADD "code" boolean`);
    }

}
