import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedConcerts1773585000000 implements MigrationInterface {
    name = 'SeedConcerts1773585000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "concert" ("name", "description", "totalSeats", "availableSeats", "createdAt", "id") VALUES
            ('Rock Night 2024', 'An amazing rock concert featuring top bands from around the world. Experience the energy of live rock music with stunning light shows and performances.', 500, 500, NOW(), uuid_generate_v4()),
            ('Jazz Evening', 'A sophisticated jazz evening with smooth melodies and improvisational performances. Perfect for music lovers who appreciate the finer things in life.', 200, 200, NOW(), uuid_generate_v4()),
            ('Pop Sensation', 'The biggest pop stars of the year gather for one spectacular night. Dance to your favorite hits and discover new music.', 1000, 1000, NOW(), uuid_generate_v4()),
            ('Classical Symphony', 'Experience the timeless beauty of classical music performed by a world-renowned symphony orchestra. A night of elegance and masterful compositions.', 300, 300, NOW(), uuid_generate_v4()),
            ('Electronic Music Festival', 'A high-energy electronic music festival featuring top DJs and producers. Feel the beat and dance all night to the latest electronic tracks.', 800, 800, NOW(), uuid_generate_v4())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "concert" WHERE "name" IN ('Rock Night 2024', 'Jazz Evening', 'Pop Sensation', 'Classical Symphony', 'Electronic Music Festival')`);
    }
}
