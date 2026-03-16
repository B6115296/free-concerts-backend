import { validate } from 'class-validator';
import { CreateConcertDto } from './create-concert.dto';

describe('CreateConcertDto', () => {
  it('should validate with valid data', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';
    dto.totalSeats = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with missing name', async () => {
    const dto = new CreateConcertDto();
    dto.description = 'A wonderful concert experience';
    dto.totalSeats = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing description', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.totalSeats = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing totalSeats', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with totalSeats less than 1', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';
    dto.totalSeats = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with negative totalSeats', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';
    dto.totalSeats = -10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with non-integer totalSeats', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';
    dto.totalSeats = 100.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should fail validation with empty strings', async () => {
    const dto = new CreateConcertDto();
    dto.name = '';
    dto.description = '';
    dto.totalSeats = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(2); // name and description errors
  });

  it('should fail validation with string totalSeats', async () => {
    const dto = new CreateConcertDto();
    dto.name = 'Test Concert';
    dto.description = 'A wonderful concert experience';
    (dto as any).totalSeats = '100';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });
});
