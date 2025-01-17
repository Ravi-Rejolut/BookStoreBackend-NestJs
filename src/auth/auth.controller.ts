import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, signupDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup(@Body() body: signupDto) {

    return this.authService.signup(body);
  }


  @Post("/login")
  login(@Body() body: loginDto) {
    return this.authService.login(body);
  }


  @Get("")
  check(){
    return "hello"
  }

 
}
