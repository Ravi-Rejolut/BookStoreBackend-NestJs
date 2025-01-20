import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderFetchDto, UpdateOrderStatus } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { Role } from '@prisma/client';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(@Req() req,@Body() body:CreateOrderDto) {
    return await this.orderService.createOrder(req,body);
  }

  @UseGuards(AuthGuard('jwt'),new RoleGaurd([Role.ADMIN,Role.MANAGER]))
  @Patch("status/:OrderId")
  async updateOrderStatus(@Req() req,@Param ("OrderId") orderId,@Body() body:UpdateOrderStatus) {
    return await this.orderService.updateOrderStatus(orderId,body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getOrders(@Query() query:OrderFetchDto,@Req() req) {
  
      return await this.orderService.getOrders(query,req);
   
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(":OrderId")
  async getOrdersByOrderId(@Param("OrderId") orderId,@Req() req) {
    try {
      return await this.orderService.getOrderByOrderID(orderId,req);
    } catch (error) {
      
    }
  }

  

 
}
