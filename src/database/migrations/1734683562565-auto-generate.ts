import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734683562565 implements MigrationInterface {
    name = 'AutoGenerate1734683562565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9"`);
        await queryRunner.query(`ALTER TABLE "favourite" DROP CONSTRAINT "FK_3f4596fab830a195bc14bc4f90d"`);
        await queryRunner.query(`ALTER TABLE "voucher" RENAME COLUMN "eventId" TO "event_id"`);
        await queryRunner.query(`ALTER TABLE "favourite" RENAME COLUMN "eventId" TO "event_id"`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_51f4aa39b669b98137d3ecdec1b" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favourite" ADD CONSTRAINT "FK_1d55bfdce6de4a5fdcea165157e" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite" DROP CONSTRAINT "FK_1d55bfdce6de4a5fdcea165157e"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_51f4aa39b669b98137d3ecdec1b"`);
        await queryRunner.query(`ALTER TABLE "favourite" RENAME COLUMN "event_id" TO "eventId"`);
        await queryRunner.query(`ALTER TABLE "voucher" RENAME COLUMN "event_id" TO "eventId"`);
        await queryRunner.query(`ALTER TABLE "favourite" ADD CONSTRAINT "FK_3f4596fab830a195bc14bc4f90d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
