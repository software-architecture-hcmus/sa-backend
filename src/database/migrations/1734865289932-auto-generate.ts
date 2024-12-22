import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734865289932 implements MigrationInterface {
    name = 'AutoGenerate1734865289932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "event_id" uuid`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_122be1f0696e0255acf95f9e336" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_122be1f0696e0255acf95f9e336"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "event_id"`);
    }

}
