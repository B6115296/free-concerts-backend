import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    
    if (user && user.email === 'john.doe@example.com') {
      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }
}
