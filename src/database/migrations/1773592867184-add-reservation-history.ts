import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationHistory1773592867184 implements MigrationInterface {
    name = 'AddReservationHistory1773592867184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservation_history_action_enum" AS ENUM('RESERVED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "reservation_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."reservation_history_action_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "reservationId" uuid, CONSTRAINT "PK_ebd15298c0a053872393bf53a23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation_history" ADD CONSTRAINT "FK_3ac37717b31a28c07c1ba18123e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_history" ADD CONSTRAINT "FK_1607c6c05fee5c358b90962dd33" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_history" DROP CONSTRAINT "FK_1607c6c05fee5c358b90962dd33"`);
        await queryRunner.query(`ALTER TABLE "reservation_history" DROP CONSTRAINT "FK_3ac37717b31a28c07c1ba18123e"`);
        await queryRunner.query(`DROP TABLE "reservation_history"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_history_action_enum"`);
    }

}
