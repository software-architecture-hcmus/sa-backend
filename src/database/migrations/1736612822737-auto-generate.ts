import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736612822737 implements MigrationInterface {
    name = 'AutoGenerate1736612822737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "qr_code"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ADD "qr_code" text`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD "code" text NOT NULL`);
    }

}
