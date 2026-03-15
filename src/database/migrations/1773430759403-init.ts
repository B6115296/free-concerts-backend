import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773430759403 implements MigrationInterface {
    name = 'Init1773430759403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "totalSeats" integer NOT NULL, "availableSeats" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_39859cb43ac2bc86a2de7d56fc4" UNIQUE ("name"), CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('RESERVED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'RESERVED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "concertId" uuid, CONSTRAINT "UQ_42d93b5a72f7493b06fdaf35784" UNIQUE ("userId", "concertId"), CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
