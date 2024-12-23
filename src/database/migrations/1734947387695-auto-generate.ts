import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734947387695 implements MigrationInterface {
    name = 'AutoGenerate1734947387695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "games" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "image" text, "allow_voucher_exchange" boolean NOT NULL DEFAULT false, "instruction" text, "status" "public"."default_games_status_enum" NOT NULL, "event_id" uuid, "default_game_id" uuid, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_9897de2a56e8ee298055075f287" FOREIGN KEY ("default_game_id") REFERENCES "default_games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_9897de2a56e8ee298055075f287"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_ffc539da32ca20c2c2ed8bdd933"`);
        await queryRunner.query(`DROP TABLE "games"`);
    }

}
