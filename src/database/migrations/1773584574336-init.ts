import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773584574336 implements MigrationInterface {
    name = 'Init1773584574336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_52b61cb2bc64db2e4873b4a5c02" UNIQUE ("email", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_52b61cb2bc64db2e4873b4a5c02"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

}
