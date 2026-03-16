import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUsers1773596000000 implements MigrationInterface {
    name = 'SeedUsers1773596000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" ("name", "email", "id") VALUES
            ('John Doe', 'john.doe@example.com', uuid_generate_v4())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE "email" = 'john.doe@example.com'`);
    }
}
