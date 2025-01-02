import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1735817406359 implements MigrationInterface {
    name = 'AutoGenerate1735817406359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_turns" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" text NOT NULL, "game_id" uuid NOT NULL, "quantity" integer DEFAULT '1', CONSTRAINT "PK_a9759df3f0412faf282578a7cae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game_turns" ADD CONSTRAINT "FK_da1e069580eb07b75b0d12c7628" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_turns" DROP CONSTRAINT "FK_da1e069580eb07b75b0d12c7628"`);
        await queryRunner.query(`DROP TABLE "game_turns"`);
    }

}
