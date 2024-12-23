import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734949488622 implements MigrationInterface {
    name = 'AutoGenerate1734949488622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_players" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_fa8e2bcf2f068c20f4c3e05ab5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_results" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_room_id" uuid, CONSTRAINT "PK_d45049161e874555e7cfe325afe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_rooms" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invite_code" text, "game_id" uuid, CONSTRAINT "PK_026d3197a67b9676bc09a996d98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_answers" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time" text NOT NULL, CONSTRAINT "PK_ae9d18a286e5b5e0c4bfcb057c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_ec0447fd30d9f5c182e7653bfd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_answers" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_3fefbc8a840a41b6a15a4f9ca5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "current_questions" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_1ad3db8f710f803fe5e6e283244" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD "started" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "game_results" ADD CONSTRAINT "FK_19b3af5c6a740cc3a9beb3718f5" FOREIGN KEY ("game_room_id") REFERENCES "game_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_rooms" ADD CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_rooms" DROP CONSTRAINT "FK_dc0216733dfde7304c8c307f8f9"`);
        await queryRunner.query(`ALTER TABLE "game_results" DROP CONSTRAINT "FK_19b3af5c6a740cc3a9beb3718f5"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "started"`);
        await queryRunner.query(`DROP TABLE "current_questions"`);
        await queryRunner.query(`DROP TABLE "quiz_answers"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "player_answers"`);
        await queryRunner.query(`DROP TABLE "game_rooms"`);
        await queryRunner.query(`DROP TABLE "game_results"`);
        await queryRunner.query(`DROP TABLE "room_players"`);
    }

}
