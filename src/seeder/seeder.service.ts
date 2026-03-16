import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedConcerts() {
    const existingConcerts = await this.concertRepository.count();
    if (existingConcerts > 0) {
      return; // Already seeded
    }

    const defaultConcerts = [
      {
        name: 'Rock Night 2024',
        description: 'An amazing rock concert featuring top bands from around the world. Experience the energy of live rock music with stunning light shows and performances.',
        totalSeats: 500,
        availableSeats: 500,
      },
      {
        name: 'Jazz Evening',
        description: 'A sophisticated jazz evening with smooth melodies and improvisational performances. Perfect for music lovers who appreciate the finer things in life.',
        totalSeats: 200,
        availableSeats: 200,
      },
      {
        name: 'Pop Sensation',
        description: 'The biggest pop stars of the year gather for one spectacular night. Dance to your favorite hits and discover new music.',
        totalSeats: 1000,
        availableSeats: 1000,
      },
      {
        name: 'Classical Symphony',
        description: 'Experience the timeless beauty of classical music performed by a world-renowned symphony orchestra. A night of elegance and masterful compositions.',
        totalSeats: 300,
        availableSeats: 300,
      },
      {
        name: 'Electronic Music Festival',
        description: 'A high-energy electronic music festival featuring top DJs and producers. Feel the beat and dance all night to the latest electronic tracks.',
        totalSeats: 800,
        availableSeats: 800,
      },
    ];

    for (const concertData of defaultConcerts) {
      const concert = this.concertRepository.create(concertData);
      await this.concertRepository.save(concert);
    }

    console.log('Database seeded with default concerts');
  }

  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      return; // Already seeded
    }

    const defaultUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    ];

    for (const userData of defaultUsers) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    console.log('Database seeded with default users');
  }

  async seedAll() {
    await this.seedUsers();
    await this.seedConcerts();
  }
}
