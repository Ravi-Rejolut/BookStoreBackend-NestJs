import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, signupDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: 'User signup' }) // Summary for the endpoint
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiBody({
    description: 'Signup details',
    type: signupDto, 
  })
  signup(@Body() body: signupDto) {

    return this.authService.signup(body);
  }


  @Post("/login")
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  @ApiBody({
    description: 'Login details',
    type: loginDto,
  })
  login(@Body() body: loginDto) {
    return this.authService.login(body);
  }


  
 
}
