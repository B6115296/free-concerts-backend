import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773659342648 implements MigrationInterface {
    name = 'Init1773659342648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
