import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1736769364095 implements MigrationInterface {
    name = 'AutoGenerate1736769364095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."request_turn_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')`);
        await queryRunner.query(`ALTER TABLE "request_turn" ADD "status" "public"."request_turn_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_turn" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."request_turn_status_enum"`);
    }

}
