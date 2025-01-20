import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { query, Request } from 'express';
import { AddressDto, CartDto, UserFetchDto } from './dto/user.dto';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { Role } from '@prisma/client';
import { serachQueryWithPagination } from 'src/constants/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getMe(@Req() req:Request) {
    return await this.userService.getMe(req);
  }

  @UseGuards(AuthGuard("jwt"),new RoleGaurd([Role.ADMIN,Role.MANAGER]))
  @Get("all")
  async getAllUser(@Query() query:UserFetchDto,@Req() req:Request){

    return this.userService.getAllUsers(query,req)

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
  @Delete("cart/:id")
  async removeItemFromCart(@Param("id") id:string,@Req() req:Request)
  {

    return await this.userService.updateCartItem({bookId:id,quantity:0},req)
  }




  @UseGuards(AuthGuard("jwt"))
  @Get("cart")
  async getCart(@Req() req:Request)
  {
    return await this.userService.getCart(req)
  }


  @UseGuards(AuthGuard("jwt"))
  @Get("shippings")
  async getShippings(@Req() req:Request)
  {
    return await this.userService.getShippingDetails(req)
  }
  @UseGuards(AuthGuard("jwt"))
  @Post("shipping")
  async addShippingDetails(@Req() req:Request,@Body() body:AddressDto)
  {
    return await this.userService.addShippingDetails(req,body)
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch("shipping/:addressId")
  async updateShippingDetails(@Req() req:Request,@Body() body:AddressDto,@Param("addressId") addressId:string)
  {
    return await this.userService.updateShippingDetails(req,body,addressId);
  }




  

  

}
