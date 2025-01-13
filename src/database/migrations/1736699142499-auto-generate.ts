import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736699142499 implements MigrationInterface {
    name = 'AutoGenerate1736699142499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ADD "total_codes" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "total_codes"`);
    }

}
