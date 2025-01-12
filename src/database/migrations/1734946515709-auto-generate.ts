import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734946515709 implements MigrationInterface {
    name = 'AutoGenerate1734946515709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."default_game_enum" AS ENUM('QUIZ', 'FLAPPYBIRD')`);
        await queryRunner.query(`CREATE TABLE "game_types" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" "public"."default_game_enum" NOT NULL, CONSTRAINT "PK_5ac179e8c7dc2527ecc0754ccac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."default_games_status_enum" AS ENUM('NOT', 'AVAILABLE')`);
        await queryRunner.query(`CREATE TABLE "default_games" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "image" text, "allow_voucher_exchange" boolean NOT NULL DEFAULT false, "instruction" text, "status" "public"."default_games_status_enum" NOT NULL, "type_id" "public"."default_game_enum", CONSTRAINT "REL_eefe0cd9fb460566529af41616" UNIQUE ("type_id"), CONSTRAINT "PK_f4acb13894a47a12fecb8dc1ec0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "default_games" ADD CONSTRAINT "FK_eefe0cd9fb460566529af416164" FOREIGN KEY ("type_id") REFERENCES "game_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // Thêm dữ liệu mẫu vào bảng game_types
        await queryRunner.query(`
            INSERT INTO "game_types" ("id") 
            VALUES 
            ('QUIZ'),
            ('FLAPPYBIRD');
        `);
        // Thêm dữ liệu mẫu vào bảng default_games
        await queryRunner.query(`
            INSERT INTO "default_games" ("name", "image", "allow_voucher_exchange", "instruction", "status", "type_id") 
            VALUES 
            ('Quiz Game', 'https://media.istockphoto.com/id/1336313511/vi/vec-to/vector-d%E1%BA%A5u-hi%E1%BB%87u-h%C3%A0i-h%C6%B0%E1%BB%9Bc-quiz-game-t%E1%BA%ADp-h%E1%BB%A3p-c%C3%A1c-ch%E1%BB%AF-c%C3%A1i-v%C3%A0-s%E1%BB%91-b%E1%BA%A3ng-ch%E1%BB%AF-c%C3%A1i-s%C3%A1ng-t%E1%BA%A1o.jpg?s=612x612&w=0&k=20&c=oXD5bGKLqZA0qLWhSoVyJ-9jyHG0TjwL6FDG144WDrU=', true, 'Instruction for Quiz Game', 'AVAILABLE', 'QUIZ'),
            ('Flappy Bird', 'https://vnn-imgs-a1.vgcloud.vn/vnreview.vn/image/11/44/57/1144578.jpg', false, 'Instruction for Flappy Bird', 'AVAILABLE', 'FLAPPYBIRD');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "default_games" DROP CONSTRAINT "FK_eefe0cd9fb460566529af416164"`);
        await queryRunner.query(`DROP TABLE "default_games"`);
        await queryRunner.query(`DROP TYPE "public"."default_games_status_enum"`);
        await queryRunner.query(`DROP TABLE "game_types"`);
        await queryRunner.query(`DROP TYPE "public"."default_game_enum"`);
    }

}
