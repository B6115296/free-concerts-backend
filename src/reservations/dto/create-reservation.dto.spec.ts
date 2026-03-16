import { validate } from 'class-validator';
import { CreateReservationDto } from './create-reservation.dto';

describe('CreateReservationDto', () => {
  it('should validate with valid data', async () => {
    const dto = new CreateReservationDto();
    dto.concertId = '550e8400-e29b-41d4-a716-446655440000';
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid UUID', async () => {
    const dto = new CreateReservationDto();
    dto.concertId = 'invalid-uuid';
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation with invalid email', async () => {
    const dto = new CreateReservationDto();
    dto.concertId = '550e8400-e29b-41d4-a716-446655440000';
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with missing concertId', async () => {
    const dto = new CreateReservationDto();
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing email', async () => {
    const dto = new CreateReservationDto();
    dto.concertId = '550e8400-e29b-41d4-a716-446655440000';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1); // Both isEmail and isNotEmpty constraints in one error
  });

  it('should fail validation with empty strings', async () => {
    const dto = new CreateReservationDto();
    dto.concertId = '';
    dto.email = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(2); // 1 error per field (multiple constraints per field)
  });

  it('should fail validation with null values', async () => {
    const dto = new CreateReservationDto();
    (dto as any).concertId = null;
    (dto as any).email = null;

    const errors = await validate(dto);
    expect(errors).toHaveLength(2); // 1 error per field (multiple constraints per field)
  });
});
