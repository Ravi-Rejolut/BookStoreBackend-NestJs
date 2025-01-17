import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(@Req() req,@Body() body:CreateOrderDto) {
    return await this.orderService.createOrder(req,body);
  }

 
}
