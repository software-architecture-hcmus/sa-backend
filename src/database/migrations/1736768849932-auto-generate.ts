import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736768849932 implements MigrationInterface {
    name = 'AutoGenerate1736768849932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request_turn" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" text NOT NULL, "receiver_id" text NOT NULL, "game_id" uuid, CONSTRAINT "PK_ee662b754ab0845c9af6d6da2e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "request_turn" ADD CONSTRAINT "FK_f6ce6423fe6f20b440a2d84c03d" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_turn" DROP CONSTRAINT "FK_f6ce6423fe6f20b440a2d84c03d"`);
        await queryRunner.query(`DROP TABLE "request_turn"`);
    }

}
