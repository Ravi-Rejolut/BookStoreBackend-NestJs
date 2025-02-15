import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AddressDto, CartDto, UserFetchDto } from './dto/user.dto';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth() // Adds BearerAuth field in Swagger
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get details of the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getMe(@Req() req: Request) {
    return await this.userService.getMe(req);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd([Role.ADMIN, Role.MANAGER]))
  @Get('all')
  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns a list of users' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users per page',
  })
  async getAllUser(@Query() query: UserFetchDto, @Req() req: Request) {
    return this.userService.getAllUsers(query, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cart')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, description: 'Item added to the cart successfully' })
  @ApiBody({ type: CartDto })
  async addToCart(@Body() body: CartDto, @Req() req: Request) {
    return await this.userService.addToCart(body, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('cart')
  @ApiOperation({ summary: 'Update an item in the cart' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiBody({ type: CartDto })
  async updateCartItem(@Body() body: CartDto, @Req() req: Request) {
    return await this.userService.updateCartItem(body, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('cart/:id')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeItemFromCart(@Param('id') id: string, @Req() req: Request) {
    return await this.userService.updateCartItem({ bookId: id, quantity: 0 }, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('cart')
  @ApiOperation({ summary: 'Get the items in the cart' })
  @ApiResponse({ status: 200, description: 'Returns cart details' })
  async getCart(@Req() req: Request) {
    return await this.userService.getCart(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('shippings')
  @ApiOperation({ summary: 'Get all shipping details of the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns shipping details' })
  async getShippings(@Req() req: Request) {
    return await this.userService.getShippingDetails(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('shipping')
  @ApiOperation({ summary: 'Add shipping details' })
  @ApiResponse({ status: 201, description: 'Shipping details added successfully' })
  @ApiBody({ type: AddressDto })
  async addShippingDetails(@Req() req: Request, @Body() body: AddressDto) {
    return await this.userService.addShippingDetails(req, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('shipping/:addressId')
  @ApiOperation({ summary: 'Update shipping details by ID' })
  @ApiResponse({ status: 200, description: 'Shipping details updated successfully' })
  @ApiResponse({ status: 404, description: 'Shipping address not found' })
  async updateShippingDetails(
    @Req() req: Request,
    @Body() body: AddressDto,
    @Param('addressId') addressId: string,
  ) {
    return await this.userService.updateShippingDetails(req, body, addressId);
  }
}
