import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736402743300 implements MigrationInterface {
    name = 'AutoGenerate1736402743300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_time" TIMESTAMP, "sender_id" text NOT NULL, "receiver_id" text NOT NULL, "token" text NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'PENDING', "customer_voucher_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_voucher" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" text NOT NULL, "voucher_id" uuid, "game_result_id" uuid, CONSTRAINT "PK_e518632fd09d365050cd0be73d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_eb31af05e85a33509ed8e8556b4" FOREIGN KEY ("customer_voucher_id") REFERENCES "customer_voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" ADD CONSTRAINT "FK_7120ceb2620d5854a46a01e852a" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" ADD CONSTRAINT "FK_904a3839e611b1a1f805b5d3406" FOREIGN KEY ("game_result_id") REFERENCES "game_results"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_voucher" DROP CONSTRAINT "FK_904a3839e611b1a1f805b5d3406"`);
        await queryRunner.query(`ALTER TABLE "customer_voucher" DROP CONSTRAINT "FK_7120ceb2620d5854a46a01e852a"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_eb31af05e85a33509ed8e8556b4"`);
        await queryRunner.query(`DROP TABLE "customer_voucher"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
    }

}
