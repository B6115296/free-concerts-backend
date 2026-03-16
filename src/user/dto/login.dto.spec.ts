import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should validate with valid email', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email format', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with missing email', async () => {
    const dto = new LoginDto();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with empty email', async () => {
    const dto = new LoginDto();
    dto.email = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1); // Both isEmail and isNotEmpty constraints in one error
  });

  it('should fail validation with null email', async () => {
    const dto = new LoginDto();
    (dto as any).email = null;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1); // Both isEmail and isNotEmpty constraints in one error
  });

  it('should validate with various valid email formats', async () => {
    const validEmails = [
      'user@domain.com',
      'user.name@domain.co.uk',
      'user+tag@domain.org',
      'user123@domain123.com',
      'test.email.with+symbol@example.com',
    ];

    for (const email of validEmails) {
      const dto = new LoginDto();
      dto.email = email;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should fail validation with various invalid email formats', async () => {
    const invalidEmails = [
      'plainaddress',
      '@domain.com',
      'user@',
      'user@domain.',
      'user..name@domain.com',
      'user@domain..com',
      'user name@domain.com',
    ];

    for (const email of invalidEmails) {
      const dto = new LoginDto();
      dto.email = email;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
