import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736443576456 implements MigrationInterface {
    name = 'AutoGenerate1736443576456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucher_codes" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "isClaimed" boolean NOT NULL DEFAULT false, "voucher_id" uuid, CONSTRAINT "PK_882c1e3621263d5b5dc5b10d9e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" ADD "code" boolean`);
        await queryRunner.query(`ALTER TABLE "voucher_codes" ADD CONSTRAINT "FK_a12bb9327710cbab97d653ce13d" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_codes" DROP CONSTRAINT "FK_a12bb9327710cbab97d653ce13d"`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" DROP COLUMN "code"`);
        await queryRunner.query(`DROP TABLE "voucher_codes"`);
    }

}
