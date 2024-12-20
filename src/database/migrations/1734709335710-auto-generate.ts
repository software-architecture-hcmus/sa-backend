import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734709335710 implements MigrationInterface {
    name = 'AutoGenerate1734709335710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "status" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "status" SET NOT NULL`);
    }

}
