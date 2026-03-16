import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773659509413 implements MigrationInterface {
    name = 'Init1773659509413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_history" DROP CONSTRAINT "FK_1607c6c05fee5c358b90962dd33"`);
        await queryRunner.query(`ALTER TABLE "reservation_history" ADD CONSTRAINT "FK_1607c6c05fee5c358b90962dd33" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_history" DROP CONSTRAINT "FK_1607c6c05fee5c358b90962dd33"`);
        await queryRunner.query(`ALTER TABLE "reservation_history" ADD CONSTRAINT "FK_1607c6c05fee5c358b90962dd33" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
