import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1734682783669 implements MigrationInterface {
    name = 'AutoGenerate1734682783669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favourite" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" text NOT NULL, "eventId" uuid, CONSTRAINT "PK_56f1996fc2983d1895e4a8f3af3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" text NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourite" ADD CONSTRAINT "FK_3f4596fab830a195bc14bc4f90d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite" DROP CONSTRAINT "FK_3f4596fab830a195bc14bc4f90d"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "favourite"`);
    }

}
