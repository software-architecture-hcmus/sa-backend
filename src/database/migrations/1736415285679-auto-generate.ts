import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736415285679 implements MigrationInterface {
    name = 'AutoGenerate1736415285679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum" USING "status"::"text"::"public"."transaction_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum_old" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"`);
    }

}
