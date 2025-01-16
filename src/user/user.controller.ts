import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CartDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getMe(@Req() req:Request) {
    return await this.userService.getMe(req);
  }


  @UseGuards(AuthGuard("jwt"))
  @Post("cart")
  async addToCart(@Body() body:CartDto,@Req() req:Request)
  {
    return await this.userService.addToCart(body,req)
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch("cart")
  async updateCartItem(@Body() body:CartDto,@Req() req:Request)
  {
    return await this.userService.updateCartItem(body,req)
  }




  @UseGuards(AuthGuard("jwt"))
  @Get("cart")
  async getCart(@Req() req:Request)
  {
    return await this.userService.getCart(req)
  }

  

}
